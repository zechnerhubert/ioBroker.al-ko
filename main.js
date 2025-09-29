"use strict";

const axios = require("axios");
const utils = require("@iobroker/adapter-core");
const WebSocket = require("ws");

// Whitelist laden (z. B. mowingWindows.monday.window_1.startHour)
let whitelist = [];
try {
	whitelist = require("./whitelist.json");
	if (!Array.isArray(whitelist)) whitelist = [];
} catch (e) {
	console.warn("Whitelist nicht gefunden, arbeite mit leerer Whitelist.");
	whitelist = [];
}

class AlKoAdapter extends utils.Adapter {
	constructor(options) {
		super({ ...options, name: "al-ko" });

		this.accessToken = null;
		this.refreshToken = null;
		this.tokenExpiresAt = null;
		this.tokenInterval = null;

		this.deviceStates = {};          // Cache für letzte bekannte States
		this.pushableStates = new Set(); // Nur whitelisted States
		this.lastStateValues = {};       // Vergleichswert für Änderungen
		this.adapterSetStates = new Set();
		this.pendingPushes = new Set();
		this.webSockets = {};            // offene WebSocket-Verbindungen pro Gerät

		this._stopRequested = false;

		this.on("ready", this.onReady.bind(this));
		this.on("unload", this.onUnload.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
	}

	// ---------------- Adapter-Start ----------------
	async onReady() {
		this.log.info(`ℹ️ Adapter läuft mit Namespace: ${this.namespace}`);

		const { clientId, clientSecret, username, password } = this.config;
		if (!clientId || !clientSecret || !username || !password) {
			this.log.error("❌ Bitte alle Zugangsdaten eintragen");
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

			// Ausgabe aller pushableStates ins Log
			this.log.info(`🔔 Abonniert ${this.pushableStates.size} schreibbare States für Push-Erkennung.`);
			this.log.debug(`DEBUG: Pushable States Liste:\n${JSON.stringify(Array.from(this.pushableStates), null, 2)}`);

			this.log.info("✅ Adapter bereit");
		} catch (err) {
			this.log.error("❌ Fehler beim Start: " + (err.response?.data || err.message || err));
		}
	}

	// ---------------- Authentifizierung ----------------
	async authenticate() {
		this.log.info("Authentifiziere bei AL-KO API…");
		const url = "https://idp.al-ko.com/connect/token";
		const params = new URLSearchParams();
		params.append("grant_type", "password");
		params.append("username", this.username);
		params.append("password", this.password);
		params.append("client_id", this.clientId);
		params.append("client_secret", this.clientSecret);
		params.append("scope", "alkoCustomerId alkoCulture offline_access introspection");

		const res = await axios.post(url, params, {
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		});
		this.accessToken = res.data.access_token;
		this.refreshToken = res.data.refresh_token;
		this.tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
		this.log.info("✅ Login erfolgreich");
	}

	async refreshAuth() {
		if (!this.refreshToken || Date.now() >= this.tokenExpiresAt - 60000) {
			this.log.info("🔄 Erneuere Access-Token…");
			const url = "https://idp.al-ko.com/connect/token";
			const params = new URLSearchParams();
			params.append("grant_type", "refresh_token");
			params.append("refresh_token", this.refreshToken);
			params.append("client_id", this.clientId);
			params.append("client_secret", this.clientSecret);
			params.append("scope", "alkoCustomerId alkoCulture offline_access introspection");

			const res = await axios.post(url, params, {
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
			});
			this.accessToken = res.data.access_token;
			this.refreshToken = res.data.refresh_token;
			this.tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
			this.log.info("✅ Token erfolgreich erneuert");
		}
	}

	scheduleTokenRefresh() {
		if (this.tokenInterval) clearInterval(this.tokenInterval);
		this.tokenInterval = setInterval(() => this.refreshAuth(), 30 * 60 * 1000);
	}

	// ---------------- Geräte & States ----------------
	async fetchAndCreateDeviceStates() {
		await this.refreshAuth();

		const url = "https://api.al-ko.com/v1/iot/things";
		const res = await axios.get(url, {
			headers: { Authorization: "Bearer " + this.accessToken, Accept: "application/json" },
		});

		const devices = res.data;
		if (devices && devices.length) {
			for (const device of devices) {
				const deviceId = device.thingName || device.name || device.id;
				const stateData = await this.getDeviceStatus(deviceId);
				if (stateData?.state) {
					this.deviceStates[deviceId] = stateData.state.reported || stateData.state;
					await this.createStatesRecursive(`al-ko.0.${deviceId}.state`, this.deviceStates[deviceId], "");

					// WebSocket starten
					this.connectWebSocket(deviceId);
				}
			}
		}
		// --- NACH dem Anlegen der States und pro Gerät aufrufen ---
		// (am besten EINMAL nach der for-Schleife über alle Devices)

		if (this.pushableStates.size) {
			let count = 0;
			for (const id of this.pushableStates) {
				try {
					this.subscribeStates(id);
					count++;
				} catch (e) {
					this.log.debug(`Konnte State nicht abonnieren: ${id} -> ${e.message}`);
				}
			}
			this.log.info(`🔔 Abonniert ${count} schreibbare States für Push-Erkennung.`);
		} else {
			// Sicherheits-Fallback: alles abonnieren, falls Whitelist leer/fehlend war
			const pattern = `${this.namespace}.*`;
			this.subscribeStates(pattern);
			this.log.warn(`⚠️ Keine pushbaren States erkannt – abonniere Fallback "${pattern}".`);
		}

	}

	async getDeviceStatus(deviceId) {
		await this.refreshAuth();
		const url = `https://api.al-ko.com/v1/iot/things/${encodeURIComponent(deviceId)}/state`;
		const res = await axios.get(url, {
			headers: { Authorization: "Bearer " + this.accessToken, Accept: "application/json" },
		});
		this.log.info("📥 Status abgerufen für: " + deviceId);
		return res.data;
	}

	// ---------------- WebSocket ----------------
	connectWebSocket(deviceId) {
		if (!this.accessToken) return;

		const url = `wss://socket.al-ko.com/v1?Authorization=${this.accessToken}&thingName=${deviceId}`;
		const ws = new WebSocket(url);

		ws.on("open", () => {
			this.log.info(`🔗 WebSocket verbunden für Gerät: ${deviceId}`);
		});

		ws.on("message", async (msg) => {
			this.log.debug(`🌐 WS-Nachricht (${deviceId}): ${msg}`);
			try {
				const data = JSON.parse(msg.toString());
				if (data && data.state) {
					this.deviceStates[deviceId] = data.state.reported || data.state;
					await this.createStatesRecursive(`al-ko.0.${deviceId}.state`, this.deviceStates[deviceId], "");
				}
			} catch (e) {
				this.log.error(`❌ Fehler beim Verarbeiten der WS-Nachricht (${deviceId}): ${e.message}`);
			}
		});

		ws.on("close", () => {
			this.log.warn(`⚠️ WebSocket geschlossen für ${deviceId}, erneuter Versuch in 10s`);
			setTimeout(() => this.connectWebSocket(deviceId), 10000);
		});

		ws.on("error", (err) => {
			this.log.error(`❌ WebSocket-Fehler (${deviceId}): ${err.message}`);
		});

		this.webSockets[deviceId] = ws;
	}

	// ---------------- State-Erzeugung ----------------
	async createStatesRecursive(basePath, obj, relPath) {
		if (!obj || typeof obj !== "object") return;

		for (const key of Object.keys(obj)) {
			const val = obj[key];
			if (val === null || val === undefined) continue;

			const currentRel = relPath ? `${relPath}.${key}` : key;
			const fullId = `${basePath}.${key}`;

			if (typeof val === "object" && !Array.isArray(val)) {
				await this.setObjectNotExistsAsync(fullId, {
					type: "channel",
					common: { name: key },
					native: {},
				});
				await this.createStatesRecursive(fullId, val, currentRel);
			} else if (Array.isArray(val)) {
				await this.setObjectNotExistsAsync(fullId, {
					type: "channel",
					common: { name: key },
					native: {},
				});
				for (let i = 0; i < val.length; i++) {
					const idxId = `${fullId}.${i}`;
					if (typeof val[i] === "object") {
						await this.setObjectNotExistsAsync(idxId, {
							type: "channel",
							common: { name: `${i}` },
							native: {},
						});
						await this.createStatesRecursive(idxId, val[i], `${currentRel}.${i}`);
					} else {
						const writable = this.isRelPathWhitelisted(`${currentRel}.${i}`);
						await this.setStateIfChanged(idxId, val[i], true, writable, `${currentRel}.${i}`);
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

	async setStateIfChanged(id, value, ack = true, write = false, relPath = null) {
		let type;
		if (typeof value === "boolean") type = "boolean";
		else if (typeof value === "number") type = "number";
		else type = "string";

		await this.setObjectNotExistsAsync(id, {
			type: "state",
			common: { type, role: "state", read: true, write },
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

	// ---------------- State-Änderungen (Push) ----------------
	async onStateChange(id, state) {
		this.log.debug(`DEBUG: onStateChange ausgelöst für ${id}, state=${JSON.stringify(state)}`);

		if (!state || this._stopRequested) return;
		if (this.adapterSetStates.has(id)) {
			this.log.debug(`DEBUG: Ignoriere eigenes Adapter-Update für ${id}`);
			return;
		}
		if (!this.pushableStates.has(id)) {
			this.log.debug(`DEBUG: Änderung an nicht-pushbarem State ${id} erkannt`);
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
			const payload = this.buildPatchPayloadFromCache(deviceId, relPathArr, state.val);
			this.log.debug(`📤 Push ${id}: ${JSON.stringify(payload)}`);

			await this.refreshAuth();
			const url = `https://api.al-ko.com/v1/iot/things/${encodeURIComponent(deviceId)}/state/desired`;
			await axios.patch(url, payload, {
				headers: { Authorization: "Bearer " + this.accessToken, "Content-Type": "application/json" },
			});

			this.log.debug(`✅ Push erfolgreich: ${id}`);
			this.updateDeviceStateCache(deviceId, relPathArr, state.val);
		} catch (err) {
			this.log.error(`❌ Fehler beim Pushen von ${id}: ${err.response?.status} ${err.response?.data || err.message}`);
		} finally {
			this.pendingPushes.delete(id);
		}
	}

	buildPatchPayloadFromCache(deviceId, relPathArr, value) {
		if (relPathArr.length === 1) return { [relPathArr[0]]: value };

		const parentParts = relPathArr.slice(0, -1);
		const leafKey = relPathArr[relPathArr.length - 1];
		const rootKey = parentParts[0];

		const deviceRoot = this.deviceStates[deviceId] || {};
		const parentObj = this.getDeep(deviceRoot, parentParts) || {};
		const parentClone = JSON.parse(JSON.stringify(parentObj));
		this.setDeep(parentClone, [leafKey], value);

		let nested = parentClone;
		const nestedParts = parentParts.slice(1);
		for (let i = nestedParts.length - 1; i >= 0; i--) {
			nested = { [nestedParts[i]]: nested };
		}
		return { [rootKey]: nested };
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
			if (!cur[pathArr[i]] || typeof cur[pathArr[i]] !== "object") cur[pathArr[i]] = {};
			cur = cur[pathArr[i]];
		}
		cur[pathArr[pathArr.length - 1]] = val;
	}

	updateDeviceStateCache(deviceId, relPathArr, value) {
		if (!this.deviceStates[deviceId]) this.deviceStates[deviceId] = {};
		this.setDeep(this.deviceStates[deviceId], relPathArr, value);
	}

	// ---------------- Adapter-Stop ----------------
	onUnload(callback) {
		try {
			this._stopRequested = true;
			if (this.tokenInterval) clearInterval(this.tokenInterval);
			for (const ws of Object.values(this.webSockets)) {
				try { ws.close(); } catch { }
			}
			this.log.info("Adapter gestoppt.");
			callback();
		} catch (e) {
			callback();
		}
	}
}

// ---------------- Export ----------------
if (require.main !== module) {
	module.exports = (options) => new AlKoAdapter(options);
} else {
	new AlKoAdapter({});
}
