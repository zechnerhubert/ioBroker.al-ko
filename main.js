"use strict";

const axios = require("axios");
const utils = require("@iobroker/adapter-core");
const WebSocket = require("ws");

// Global axios timeout
axios.defaults.timeout = 6000;

// Load whitelist
let whitelist = [];
try {
  whitelist = require("./whitelist.json");
  if (!Array.isArray(whitelist)) {
    whitelist = [];
  }
} catch (_e) {
  console.warn("Whitelist not found, using empty whitelist.");
  whitelist = [];
}

class AlKoAdapter extends utils.Adapter {
  constructor(options) {
    super({ ...options, name: "al-ko" });

    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiresAt = null;
    this.tokenInterval = null;

    this.deviceStates = {};
    this.pushableStates = new Set();
    this.lastStateValues = {};
    this.adapterSetStates = new Set();
    this.pendingPushes = new Set();

    this.webSockets = {};
    this.reconnectTimeouts = {};
    this.pingIntervals = {};
    this.pongTimeouts = {};

    this._stopRequested = false;

    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
    this.on("stateChange", this.onStateChange.bind(this));
  }

  // ---------------- ID Sanitizer ----------------
  sanitizeId(id) {
    return id
      .replace(/[^A-Za-z0-9\-_.:]/g, "_")
      .replace(/\.+/g, ".")
      .replace(/_+/g, "_")
      .replace(/^\./, "")
      .replace(/\.$/, "");
  }

  // ---------------- Adapter Startup ----------------
  async onReady() {
    this.log.info(`Adapter started. Namespace: ${this.namespace}`);

    const { clientId, clientSecret, username, password } = this.config;
    if (!clientId || !clientSecret || !username || !password) {
      this.log.error(
        "Missing API credentials. Please fill in all configuration fields.",
      );
      return;
    }
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.username = username;
    this.password = password;

    try {
      await this.authenticate();
      this.scheduleTokenRefresh();
      await this.fetchAndCreateDeviceStates();

      this.log.debug(
        `Subscribed ${this.pushableStates.size} writable states for push detection.`,
      );
      this.log.info("Adapter is ready.");
    } catch (err) {
      this.log.error(
        `Startup error: ${err.response?.data || err.message || err}`,
      );
    }
  }

  // ---------------- Authentication ----------------
  async authenticate() {
    this.log.info("Authenticating with AL-KO API...");

    const url = "https://idp.al-ko.com/connect/token";
    const params = new URLSearchParams();
    params.append("grant_type", "password");
    params.append("username", this.username);
    params.append("password", this.password);
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);
    params.append(
      "scope",
      "alkoCustomerId alkoCulture offline_access introspection",
    );

    const res = await axios.post(url, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    this.accessToken = res.data.access_token;
    this.refreshToken = res.data.refresh_token;
    this.tokenExpiresAt = Date.now() + res.data.expires_in * 1000;

    this.log.info("Login successful.");
  }

  async refreshAuth() {
    if (!this.refreshToken || Date.now() >= this.tokenExpiresAt - 60000) {
      this.log.debug("Refreshing access token...");

      const url = "https://idp.al-ko.com/connect/token";
      const params = new URLSearchParams();
      params.append("grant_type", "refresh_token");
      params.append("refresh_token", this.refreshToken);
      params.append("client_id", this.clientId);
      params.append("client_secret", this.clientSecret);
      params.append(
        "scope",
        "alkoCustomerId alkoCulture offline_access introspection",
      );

      const res = await axios.post(url, params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      this.accessToken = res.data.access_token;
      this.refreshToken = res.data.refresh_token;
      this.tokenExpiresAt = Date.now() + res.data.expires_in * 1000;

      this.log.debug("Access token refreshed successfully.");
    }
  }

  scheduleTokenRefresh() {
    if (this.tokenInterval) {
      this.clearInterval(this.tokenInterval);
    }
    this.tokenInterval = this.setInterval(
      () => this.refreshAuth(),
      30 * 60 * 1000,
    );
  }

  // ---------------- Device Fetch / State Creation ----------------
  async fetchAndCreateDeviceStates() {
    await this.refreshAuth();

    const url = "https://api.al-ko.com/v1/iot/things";
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/json",
      },
    });

    const devices = res.data;
    if (devices && devices.length) {
      for (const device of devices) {
        const deviceId = this.sanitizeId(
          device.thingName || device.name || device.id,
        );

        await this.setObjectNotExistsAsync(`${this.namespace}.${deviceId}`, {
          type: "device",
          common: { name: deviceId, role: "device" },
          native: {},
        });

        const stateData = await this.getDeviceStatus(deviceId);
        if (stateData?.state) {
          this.deviceStates[deviceId] =
            stateData.state.reported || stateData.state;

          await this.createStatesRecursive(
            `${this.namespace}.${deviceId}.state`,
            this.deviceStates[deviceId],
            "",
          );

          this.connectWebSocket(deviceId);
        }
      }
    }

    if (this.pushableStates.size) {
      let count = 0;
      for (const id of this.pushableStates) {
        try {
          this.subscribeStates(id);
          count++;
        } catch (e) {
          this.log.debug(`Could not subscribe state ${id}: ${e.message}`);
        }
      }
      this.log.debug(`Subscribed ${count} writable states for push detection.`);
    } else {
      const pattern = `${this.namespace}.*`;
      this.subscribeStates(pattern);
      this.log.warn(
        `No writable states detected. Subscribing fallback pattern "${pattern}".`,
      );
    }
  }
  async getDeviceStatus(deviceId) {
    await this.refreshAuth();
    const url = `https://api.al-ko.com/v1/iot/things/${encodeURIComponent(deviceId)}/state`;

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: "application/json",
      },
    });

    this.log.debug(`Status fetched for device ${deviceId}`);
    return res.data;
  }

  // ---------------- WebSocket Handling ----------------
  connectWebSocket(deviceId) {
    if (!this.accessToken) return;

    const url = `wss://socket.al-ko.com/v1?Authorization=${this.accessToken}&thingName=${deviceId}`;
    const ws = new WebSocket(url);

    ws.isAlive = true;

    ws.on("open", () => {
      this.log.debug(`WebSocket connected for device ${deviceId}`);

      this.pingIntervals[deviceId] = this.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.ping();
          ws.isAlive = false;

          this.pongTimeouts[deviceId] = this.setTimeout(() => {
            if (!ws.isAlive) {
              this.log.warn(
                `WebSocket ping timeout for ${deviceId}, closing connection.`,
              );
              ws.terminate();
            }
          }, 30000);
        }
      }, 120000);
    });

    ws.on("pong", () => {
      ws.isAlive = true;
      this.clearTimeout(this.pongTimeouts[deviceId]);
    });

    ws.on("message", async (msg) => {
      if (this.config.wsDebug) {
        this.log.debug(`WebSocket message (${deviceId}): ${msg}`);
      }
      try {
        const data = JSON.parse(msg.toString());
        if (data && data.state) {
          const newState = data.state.reported || data.state;

          this.deviceStates[deviceId] = this.deepMerge(
            this.deviceStates[deviceId] || {},
            newState,
          );

          await this.createStatesRecursive(
            `${this.namespace}.${deviceId}.state`,
            this.deviceStates[deviceId],
            "",
          );
        }
      } catch (e) {
        this.log.error(
          `Error processing WebSocket message for device ${deviceId}: ${e.message}`,
        );
      }
    });

    ws.on("close", () => {
      this.log.warn(
        `WebSocket closed for device ${deviceId}. Retrying in 10 seconds.`,
      );
      this.clearInterval(this.pingIntervals[deviceId]);
      this.clearTimeout(this.pongTimeouts[deviceId]);

      this.reconnectTimeouts[deviceId] = this.setTimeout(
        () => this.connectWebSocket(deviceId),
        10000,
      );
    });

    ws.on("error", (err) => {
      this.log.error(`WebSocket error for ${deviceId}: ${err.message}`);
      try {
        ws.terminate();
      } catch {}
    });

    this.webSockets[deviceId] = ws;
  }

  // ---------------- Deep Merge Logic ----------------
  deepMerge(target, source) {
    if (typeof target !== "object" || target === null) {
      return JSON.parse(JSON.stringify(source));
    }
    if (typeof source !== "object" || source === null) {
      return target;
    }

    const output = { ...target };
    for (const key of Object.keys(source)) {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }

  // ---------------- Recursive State Creation ----------------
  async createStatesRecursive(basePath, obj, relPath) {
    if (!obj || typeof obj !== "object") return;

    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val === null || val === undefined) continue;

      const currentRel = relPath ? `${relPath}.${key}` : key;
      const fullId = this.sanitizeId(`${basePath}.${key}`);

      if (typeof val === "object" && !Array.isArray(val)) {
        await this.setObjectNotExistsAsync(fullId, {
          type: "channel",
          common: { name: key, role: "channel" },
          native: {},
        });
        await this.createStatesRecursive(fullId, val, currentRel);
      } else if (Array.isArray(val)) {
        await this.setObjectNotExistsAsync(fullId, {
          type: "channel",
          common: { name: key, role: "channel" },
          native: {},
        });
        for (let i = 0; i < val.length; i++) {
          const idxId = `${fullId}.${i}`;
          if (typeof val[i] === "object") {
            await this.setObjectNotExistsAsync(idxId, {
              type: "channel",
              common: { name: `${i}`, role: "channel" },
              native: {},
            });
            await this.createStatesRecursive(
              idxId,
              val[i],
              `${currentRel}.${i}`,
            );
          } else {
            const writable = this.isRelPathWhitelisted(`${currentRel}.${i}`);
            await this.setStateIfChanged(
              idxId,
              val[i],
              true,
              writable,
              `${currentRel}.${i}`,
            );
            if (writable) this.pushableStates.add(idxId);
          }
        }
      } else {
        const writable = this.isRelPathWhitelisted(currentRel);
        await this.setStateIfChanged(fullId, val, true, writable, currentRel);
        if (writable) this.pushableStates.add(fullId);
      }
    }
  }

  isRelPathWhitelisted(relPath) {
    return whitelist.includes(relPath);
  }
  // ---------------- Role Mapping ----------------
  mapRole(relPath, type) {
    if (!relPath) return "state";

    const lower = relPath.toLowerCase();

    if (lower.endsWith("starthour") || lower.endsWith("hour"))
      return "value.hour";
    if (lower.endsWith("startminute") || lower.endsWith("minute"))
      return "value.minute";

    if (type === "boolean") {
      if (
        lower.includes("mode") ||
        lower.includes("enabled") ||
        lower.includes("manualmowing")
      ) {
        return "switch";
      }
      return "indicator";
    }

    if (lower.includes("operationstate") || lower.includes("state")) {
      return "indicator.status";
    }

    if (type === "number") {
      if (lower.includes("battery")) return "value.battery";
      return "value";
    }

    if (type === "string") return "text";

    return "state";
  }

  // ---------------- Safe setState wrapper ----------------
  async setStateIfChanged(
    id,
    value,
    ack = true,
    write = false,
    relPath = null,
  ) {
    let type;
    if (typeof value === "boolean") type = "boolean";
    else if (typeof value === "number") type = "number";
    else type = "string";

    id = this.sanitizeId(id);

    await this.setObjectNotExistsAsync(id, {
      type: "state",
      common: { type, role: this.mapRole(relPath, type), read: true, write },
      native: {},
    });

    const prev = this.lastStateValues[id];
    if (prev !== value) {
      this.lastStateValues[id] = value;
      this.adapterSetStates.add(id);
      try {
        await this.setStateAsync(id, { val: value, ack });
      } finally {
        setImmediate(() => this.adapterSetStates.delete(id));
      }
    }
  }

  // ---------------- onStateChange → Push to AL-KO ----------------
  async onStateChange(id, state) {
    id = this.sanitizeId(id);

    if (!state || this._stopRequested) return;
    if (this.adapterSetStates.has(id)) return;
    if (!this.pushableStates.has(id)) {
      this.log.debug(`State change ignored for non-writable state ${id}`);
      return;
    }
    if (this.pendingPushes.has(id)) return;

    const last = this.lastStateValues[id];
    if (last === state.val) return;

    this.lastStateValues[id] = state.val;

    const parts = id.split(".");
    const deviceId = parts[2];
    const relPathArr = parts.slice(4);

    this.pendingPushes.add(id);

    try {
      this.log.debug(`Writable state changed: ${id} = ${state.val}`);

      const payload = this.buildPatchPayloadFromCache(
        deviceId,
        relPathArr,
        state.val,
      );
      this.log.debug(`Sending push for ${id}: ${JSON.stringify(payload)}`);

      await this.refreshAuth();
      const url = `https://api.al-ko.com/v1/iot/things/${encodeURIComponent(deviceId)}/state/desired`;

      await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      this.log.info(`Push successful: ${id}`);
      this.updateDeviceStateCache(deviceId, relPathArr, state.val);
    } catch (err) {
      this.log.error(
        `Error pushing state ${id}: ${err.response?.status} ${err.response?.data || err.message}`,
      );
    } finally {
      this.pendingPushes.delete(id);
    }
  }

  // ---------------- Build Patch Payload ----------------
  buildPatchPayloadFromCache(deviceId, relPathArr, value) {
    if (!Array.isArray(relPathArr) || relPathArr.length === 0) {
      throw new Error("Invalid relPathArr");
    }

    if (relPathArr.length === 1) {
      return { [relPathArr[0]]: value };
    }

    const parentParts = relPathArr.slice(0, -1);
    const leafKey = relPathArr[relPathArr.length - 1];
    const rootKey = parentParts[0];

    const deviceRoot = this.deviceStates[deviceId] || {};
    const parentObj = this.getDeep(deviceRoot, parentParts) || {};

    const parentClone = JSON.parse(JSON.stringify(parentObj));
    this.setDeep(parentClone, [leafKey], value);

    const parentRelPrefix = parentParts.join(".");
    const filteredParent = this.filterObjectByWhitelist(
      parentClone,
      parentRelPrefix,
    );

    let nested = filteredParent;
    const nestedParts = parentParts.slice(1);

    for (let i = nestedParts.length - 1; i >= 0; i--) {
      nested = { [nestedParts[i]]: nested };
    }

    return { [rootKey]: nested };
  }

  filterObjectByWhitelist(obj, parentRelPrefix) {
    const relevant = whitelist
      .filter(
        (p) => p === parentRelPrefix || p.startsWith(`${parentRelPrefix}.`),
      )
      .map((p) => p.slice(parentRelPrefix.length + 1))
      .filter((s) => !!s);

    if (relevant.length === 0) {
      if (whitelist.includes(parentRelPrefix)) return obj;
      return {};
    }

    const tree = {};
    for (const rel of relevant) {
      const parts = rel.split(".");
      let cur = tree;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (!cur[part]) cur[part] = {};
        cur = cur[part];
      }
    }

    const copyAllowed = (source, schema) => {
      if (source === null || typeof source !== "object") return source;

      if (Array.isArray(source)) {
        const resArr = [];
        for (let i = 0; i < source.length; i++) {
          const key = String(i);
          if (schema[key]) resArr[i] = copyAllowed(source[i], schema[key]);
        }
        return resArr;
      }

      const res = {};
      for (const k of Object.keys(schema)) {
        if (Object.prototype.hasOwnProperty.call(source, k)) {
          res[k] = copyAllowed(source[k], schema[k]);
        }
      }
      return res;
    };

    return copyAllowed(obj, tree);
  }

  getDeep(obj, pathArr) {
    let cur = obj;
    for (const p of pathArr) {
      if (cur == null || typeof cur !== "object") return undefined;
      cur = cur[p];
    }
    return cur;
  }

  setDeep(obj, pathArr, val) {
    let cur = obj;
    for (let i = 0; i < pathArr.length - 1; i++) {
      if (!cur[pathArr[i]] || typeof cur[pathArr[i]] !== "object") {
        cur[pathArr[i]] = {};
      }
      cur = cur[pathArr[i]];
    }
    cur[pathArr[pathArr.length - 1]] = val;
  }

  updateDeviceStateCache(deviceId, relPathArr, value) {
    if (!this.deviceStates[deviceId]) {
      this.deviceStates[deviceId] = {};
    }
    this.setDeep(this.deviceStates[deviceId], relPathArr, value);
  }

  // ---------------- Adapter Stop ----------------
  onUnload(callback) {
    try {
      this._stopRequested = true;

      if (this.tokenInterval) this.clearInterval(this.tokenInterval);

      for (const t of Object.values(this.reconnectTimeouts)) {
        try {
          this.clearTimeout(t);
        } catch {}
      }
      for (const t of Object.values(this.pingIntervals)) {
        try {
          this.clearInterval(t);
        } catch {}
      }
      for (const t of Object.values(this.pongTimeouts)) {
        try {
          this.clearTimeout(t);
        } catch {}
      }

      for (const ws of Object.values(this.webSockets)) {
        try {
          ws.close();
        } catch {}
      }

      this.log.info("Adapter stopped.");
      callback();
    } catch (_e) {
      callback();
    }
  }
}

if (require.main !== module) {
  module.exports = (options) => new AlKoAdapter(options);
} else {
  new AlKoAdapter({});
}
