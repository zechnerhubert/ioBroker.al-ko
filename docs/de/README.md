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

### 0.3.11 (2026-05-07)
- CI-Probleme behoben und Workflow stabilisiert
- Release-Tools aktualisiert
- Node.js >= 22.13.0 erforderlich
- Codequalität verbessert (eslint/prettier)

### 0.3.10 (2026-05-07)
- i18n auf Kurzformat umgestellt
- tsconfig auf Node.js 22 angepasst
- Node.js-Anforderung auf >=22.13.0 erhöht
- CI-Konfiguration stabilisiert

### 0.3.9 (2026-05-07)
- Fehlenden Changelog-Eintrag für 0.3.8 ergänzt
- Versionsabgleich

### 0.3.8 (2026-05-07)
- CI/npm Publish-Probleme behoben
- Abhängigkeiten aktualisiert
- Stabilitätsverbesserungen

### 0.3.7 (2026-05-07)
- Abhängigkeiten aktualisiert (inkl. Axios Sicherheitsfixes)
- Node.js >= 22 erforderlich
- Stabilitätsverbesserungen

### 0.3.6 (2026-04-26)

- Ungültige State-Rollen korrigiert (`value.number` entfernt, korrekte Verwendung von `value` und `level`)
- Whitelist für schreibbare States korrigiert
- Objektstruktur gemäß Review-Anforderungen verbessert

### 0.3.5 (2026-03-26)

- npm Trusted Publishing aktiviert
- GitHub Actions Workflow-Warnungen behoben


Alle Änderungen siehe vollständigen Changelog:  
➡ [CHANGELOG_OLD.md](../../CHANGELOG_OLD.md)

Wesentliche Neuerungen:

- Verbesserte Objektstruktur
- Überarbeitetes Logging
- Verbesserte ID-Sanitärisierung
- Globale Timeouts und adapter-sichere Timer
- Dokumentation überarbeitet

---

## Lizenz

Veröffentlicht unter der **MIT-Lizenz**.
