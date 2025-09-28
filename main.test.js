"use strict";

const axios = require("axios");

// 👉 Deine Zugangsdaten hier eintragen
const username = "hubert.zechner@posteo.at";
const password = "2schwer4Hacker#007";
const clientId = "hubert.zechner_at_posteo.at";
const clientSecret = "0560ba8a-46d1-4c66-8c73-1e1d638c7b5e";

// Tokens
let accessToken = null;
let refreshToken = null;
let tokenExpiresAt = null;

/**
 * Authentisierung via Password-Flow
 */
async function authenticate() {
	console.log("Authentifiziere (Password Flow)…");

	const url = "https://idp.al-ko.com/connect/token";
	const params = new URLSearchParams();
	params.append("grant_type", "password");
	params.append("username", username);
	params.append("password", password);
	params.append("client_id", clientId);
	params.append("client_secret", clientSecret);
	params.append("scope", "alkoCustomerId alkoCulture offline_access introspection");

	const res = await axios.post(url, params, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});

	accessToken = res.data.access_token;
	refreshToken = res.data.refresh_token;
	tokenExpiresAt = Date.now() + res.data.expires_in * 1000;

	console.log("✅ Login erfolgreich");
	// Optionale Ausgabe:
	console.log(` AccessToken: ${accessToken.substring(0, 20)}...`);
	console.log(` RefreshToken: ${refreshToken.substring(0, 20)}...`);
}

/**
 * Neue Tokens anfordern, wenn AccessToken abläuft.
 */
async function refreshAuth() {
	if (!refreshToken) {
		return authenticate();
	}
	if (Date.now() < tokenExpiresAt - 60000) return;

	console.log("Erneuere Access-Token…");

	const url = "https://idp.al-ko.com/connect/token";
	const params = new URLSearchParams();
	params.append("grant_type", "refresh_token");
	params.append("refresh_token", refreshToken);
	params.append("client_id", clientId);
	params.append("client_secret", clientSecret);
	params.append("scope", "alkoCustomerId alkoCulture offline_access introspection");

	const res = await axios.post(url, params, {
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});

	accessToken = res.data.access_token;
	refreshToken = res.data.refresh_token;
	tokenExpiresAt = Date.now() + res.data.expires_in * 1000;

	console.log("✅ Token erfolgreich erneuert");
}

/**
 * Geräte abrufen
 */
async function getDevices() {
	await refreshAuth();

	const url = "https://api.al-ko.com/v1/iot/things";
	const res = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	console.log("✅ Geräte-Liste geladen:", res.data);
	return res.data;
}

/**
 * Gerätestatus holen
 */
async function getDeviceStatus(thingName) {
	await refreshAuth();

	const url = `https://api.al-ko.com/v1/iot/things/${encodeURIComponent(thingName)}/state`;
	const res = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json",
		},
	});

	console.log("Status:", res.data);
	return res.data;
}

(async () => {
	try {
		await authenticate();
		const devices = await getDevices();
		if (devices && devices.length) {
			await getDeviceStatus(devices[0].thingName || devices[0].name || devices[0].id);
		}
	} catch (err) {
		console.error("❌ Fehler:", err.response?.data || err.message);
	}
})();