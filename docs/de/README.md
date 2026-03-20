# ioBroker.al-ko – Deutsche Dokumentation

![Logo](../../admin/al-ko-128.png)

## Überblick

Der ioBroker.al-ko Adapter integriert **AL-KO Robolinho Rasenroboter** und weitere AL-KO Smart-Garden-Geräte in ioBroker.  
Die Kommunikation erfolgt über die **offizielle AL-KO Cloud API**, inklusive Echtzeit-Updates per WebSocket.

---

## Funktionen

- Verbindung zur offiziellen AL-KO Cloud API
- Automatische Erstellung aller lesbaren Zustände
- Schreibbare Zustände über Whitelist steuerbar
- Änderungen werden per PATCH an AL-KO (`desired` State) übermittelt
- Echtzeitupdates per WebSocket
- Unterstützung mehrerer Geräte
- Kompatibel mit modernem ioBroker Admin / jsonConfig

---

## Voraussetzungen

Für die Nutzung werden AL-KO API-Zugangsdaten benötigt:

Anfordern unter:  
➡ https://alko-garden.at/iot-api-zugang-anfordern/

Erforderlich:

- Benutzername
- Passwort
- Client ID
- Client Secret

Eintragen unter: **Instanzen → al-ko → Konfiguration**

---

## Haftungsausschluss

Dieser Adapter ist ein **Community-Projekt**.  
AL-KO bietet **keinen offiziellen Support** hierfür.

---

## Änderungen (Auszug)

### 0.3.4 (2026-03-20)

- Responsives Layout in der jsonConfig korrigiert (xs/sm/md/lg/xl)
- Beispielhafte i18n-Einträge (option1/option2) entfernt

### 0.3.3 (2026-03-13)

- WebSocket-Verarbeitung verbessert
- Verarbeitung der AL-KO `reportedState` WebSocket-Nachrichten korrigiert
- Stabileres Wiederverbinden der WebSocket-Verbindung
- GitHub-Workflows aktualisiert (Dependabot / Automerge)
- Entwicklungsabhängigkeiten aktualisiert

### 0.3.2 (2026-03-12)

- WebSocket-Reconnect nach Token-Aktualisierung verbessert
- Reconnect-Schleifen bei absichtlich geschlossenen WebSocket-Verbindungen verhindert
- API-Fehlerlogging für Push-Requests verbessert
- Logging für WebSocket-Close-Code und Reason ergänzt

Alle Änderungen siehe vollständigen Changelog:  
➡ [CHANGELOG.md](../../CHANGELOG.md)

Wesentliche Neuerungen:

- Verbesserte Objektstruktur
- Überarbeitetes Logging
- Verbesserte ID-Sanitärisierung
- Globale Timeouts und adapter-sichere Timer
- Dokumentation überarbeitet

---

## Lizenz

Veröffentlicht unter der **MIT-Lizenz**.
