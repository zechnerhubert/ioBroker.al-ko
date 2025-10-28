![Logo](admin/al-ko.png)
# ioBroker.al-ko

[![NPM version](https://img.shields.io/npm/v/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
[![Downloads](https://img.shields.io/npm/dm/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
![Number of Installations](https://iobroker.live/badges/al-ko-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/al-ko-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.al-ko.png?downloads=true)](https://nodei.co/npm/iobroker.al-ko/)

**Tests:** ![Test and Release](https://github.com/zechnerhubert/ioBroker.al-ko/workflows/Test%20and%20Release/badge.svg)

---

## ioBroker.al-ko

Adapter zur Kommunikation mit **AL-KO Robolinho** und weiteren AL-KO Gartengeräten.

Adapter for communication with **AL-KO Robolinho** and other AL-KO garden tools.

---

## Funktionsumfang / Features

- Verbindung mit der offiziellen **AL-KO Cloud API**
- Automatisches Anlegen aller relevanten States
- Alle schreibbaren States werden berücksichtigt (Whitelist)
- Änderungen an States werden per API zurück in die Cloud gepusht
- Gerätestatus wird automatisch und in Echtzeit über **WebSocket** aktualisiert
- Authentifizierung via Benutzername / Passwort und API-Client-Daten

---

## Konfiguration

Um den Adapter zu nutzen, benötigen Sie API-Zugangsdaten von AL-KO.  
Diese können Sie hier beantragen:  
👉 [AL-KO IoT API Zugang](https://alko-garden.at/iot-api-zugang-anfordern/)

Im Admin müssen folgende Daten hinterlegt werden:
- **Username** (AL-KO Konto)
- **Password**
- **Client ID**
- **Client Secret**

---

## DISCLAIMER

Dieser Adapter steht **in keinem Zusammenhang mit der Firma AL-KO**.  
Es handelt sich um ein Community-Projekt, und AL-KO bietet **keinen Support** dafür an.

---

## Changelog

### 0.2.10 (2025-10-28)

**Deutsch:**
- Adapter-Kategorie angepasst: Typ von 'hardware' auf 'garden' geändert.
- Keine funktionalen Änderungen für Anwender

**English:** 
- Changed adapter type from 'hardware' to 'garden' for proper categorization in ioBroker Admin and repositories.
- No functional changes for end users  

### 0.2.9 (2025-10-28)

**Deutsch:**  
- Wartungsupdate: npm-Abhängigkeitskonflikte (`sinon-chai` vs. `chai`) behoben  
- ESLint-Konfiguration auf Version 9 mit `@iobroker/eslint-config` v2.2.0 aktualisiert  
- CI-Stabilität auf GitHub Actions verbessert  
- Keine funktionalen Änderungen für Anwender

**English:**  
- Maintenance update: resolved npm dependency conflicts (`sinon-chai` vs `chai`)  
- Updated ESLint setup to v9 + `@iobroker/eslint-config` v2.2.0  
- Improved GitHub Actions CI stability  
- No functional changes for end users  

### 0.2.8 (2025-10-26)

**Deutsch:**
- Externes Icon durch optimierte 128×128-Version ersetzt, um die Anzeige in npm und ioBroker Admin zu korrigieren  
- Repository-Pfad auf `master` umgestellt, um korrekte Paketauflösung sicherzustellen  
- Keine funktionalen Änderungen  

**English:**
- Replaced external icon with optimized 128×128 version for proper display in npm and ioBroker Admin  
- Adjusted repository path to `master` branch for correct package resolution  
- No functional changes  

### 0.2.7 (2025-10-26)

**Deutsch:**
- Adapter-Check-Konformität: Icon-Verweise vereinheitlicht (icon/extIcon nutzen jetzt beide `al-ko-128.png` von GitHub) und Bildgröße ≤ 512 px sichergestellt
- Unnötiges `publishConfig` aus `package.json` entfernt
- Keine funktionalen Änderungen

**English:**
- Adapter-check compliance: unified icon references (icon/extIcon now both use `al-ko-128.png` from GitHub) and ensured image size ≤ 512 px
- Removed unnecessary `publishConfig` from `package.json`
- No functional changes

## License
MIT License

Copyright (c) 2025 Hubert <hubertiob@posteo.at>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
