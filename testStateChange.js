"use strict";

// Dev-Server Adapter-Schnittstelle simulieren
const utils = require("@iobroker/adapter-core");

async function runTest() {
	// Adapter starten
	const adapter = new (require("./main.js"))({ name: "al-ko" });

	// Warten, bis Adapter ready ist
	adapter.on("ready", async () => {
		console.log("Adapter ist ready. Test startet...");

		// Wir wählen einen existierenden State oder erstellen einen Test-State
		const testStateId = "al-ko.0.testDevice.state.manualTest";

		// Initial setzen (ack=true, damit kein Push erfolgt)
		await adapter.setStateAsync(testStateId, { val: false, ack: true });
		console.log(`Initial state gesetzt: ${testStateId} = false`);

		// Kurz warten und dann ändern (ack=false → Push)
		setTimeout(async () => {
			console.log(`State wird geändert: ${testStateId} = true`);
			await adapter.setStateAsync(testStateId, { val: true, ack: false });
		}, 2000);
	});

	adapter.on("stateChange", (id, state) => {
		if (state) {
			console.log(`EVENT: StateChange erkannt -> ${id} = ${state.val} (ack=${state.ack})`);
		}
	});
}

runTest().catch(console.error);
