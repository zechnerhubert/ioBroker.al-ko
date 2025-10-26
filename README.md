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

### 0.2.6 (2025-10-26)

**Deutsch:**
- Korrigierte externe Icon-URL (`extIcon`) – verweist nun auf den korrekten Branch `master` anstelle von `main`
- Keine funktionalen Änderungen

**English:**
- Fixed external icon URL (`extIcon`) – now points to the correct `master` branch instead of `main`
- No functional changes

### 0.2.5 (2025-10-23)

**Deutsch:**
- Neues kompaktes AL-KO-Logo (`admin/al-ko-128.png`) hinzugefügt  
- Kleinere kosmetische Anpassungen in der Dokumentation  

**English:**
- Added new compact AL-KO logo (`admin/al-ko-128.png`)  
- Minor cosmetic improvements in documentation  

### 0.2.4 (2025-10-23)

**Deutsch:**
- Metadaten-Anpassungen für korrekte Anzeige im ioBroker Admin und auf npm
- Der Autor wird jetzt korrekt angezeigt, und das Adapter-Icon erscheint im Admin
- Keine funktionalen Änderungen am Code

**English:**
- Metadata adjustments for correct display in ioBroker Admin and npm
- Author information and adapter icon are now shown correctly
- No functional changes to the code

### 0.2.3 (2025-10-22)

**Deutsch:**
- WebSocket-Stabilität deutlich verbessert:
  - Heartbeat (Ping/Pong) alle **120 Sekunden** mit **30 Sekunden** Timeout
  - Bei fehlendem Pong oder Fehlern wird die Verbindung **aktiv beendet**, damit ein sauberer **Reconnect** erfolgt
  - Entfernt: „Silence-Watchdog“, damit es in längeren Ruhephasen (z. B. nachts) **keine unnötigen Reconnects** gibt

**English:**
- Improved WebSocket stability:
  - Heartbeat (ping/pong) every **120 seconds** with **30 seconds** timeout
  - If pong is missing or errors occur, the socket is **terminated** to trigger a clean **reconnect**
  - Removed the **silence watchdog** to avoid unnecessary reconnects during long idle periods (e.g., at night)


### 0.2.2 (2025-10-20)

**Deutsch:**
* Vorbereitung auf die erste npm-Veröffentlichung
* Versionsnummern zwischen `io-package.json` und `package.json` synchronisiert
* npm-Metadaten ergänzt und Veröffentlichungskonfiguration hinzugefügt
* Kleinere interne Anpassungen für bessere Kompatibilität mit npm-Publishing

**English:**
* Prepared for first npm release
* Synchronized version numbers between `io-package.json` and `package.json`
* Added npm metadata and publication configuration
* Minor internal adjustments for improved npm-publish compatibility


### 0.2.1 (2025-10-19)

**Deutsch:**
- Neue Admin-UI-Option zum Aktivieren/Deaktivieren des WebSocket-Nachrichten-Loggings (`wsDebug`)
- Das Logging eingehender WebSocket-Nachrichten kann nun direkt in der Adapter-Konfiguration gesteuert werden
- Kleine interne Anpassungen zur Verbesserung der Konfigurierbarkeit und Log-Flexibilität

**English:**
- Added new Admin UI option to enable/disable WebSocket message logging (`wsDebug`)
- Logging of incoming WebSocket messages can now be toggled directly from the adapter configuration
- Minor internal improvements for configurability and logging flexibility

---

### 0.2.0 (2025-10-08)

**Deutsch:**
- 🧹 Migration auf ESLint 9 (Flat-Config)
  - Alte `.eslintrc`-Dateien entfernt und durch `eslint.config.mjs` ersetzt
  - `package.json` angepasst (neue Dev-Dependencies: `@eslint/js`, `typescript-eslint`, `@iobroker/eslint-config`, `prettier`)
  - Lint-Scope auf `main.js` und `lib/` beschränkt
  - Alle bisherigen Lint-Fehler und Warnungen behoben
- 💡 Vorbereitung auf zukünftige „Produktiv-Lint“-Variante für Releases

**English:**
- 🧹 Migrated to ESLint 9 (Flat Config)
  - Removed old `.eslintrc` files and replaced with `eslint.config.mjs`
  - Updated `package.json` (new devDependencies: `@eslint/js`, `typescript-eslint`, `@iobroker/eslint-config`, `prettier`)
  - Limited lint scope to `main.js` and `lib/`
  - Fixed all existing lint errors and warnings
- 💡 Preparation for future “production lint” variant for releases

---

### 0.1.2 (2025-09-30)

**Deutsch:**
- Verbesserte Admin-UI-Konfiguration
- Fehler bei der Adapterprüfung behoben

**English:**
- Improved Admin UI configuration
- Fixed adapter-check validation issues

---

### 0.1.1 (2025-09-29)

**Deutsch:**
- ✨ Erste Veröffentlichung
- Verbindung mit der AL-KO API
- Automatisches Anlegen der States
- Push von Änderungen an AL-KO
- WebSocket-Integration für Echtzeit-Updates

**English:**
- ✨ Initial release
- Connection to the AL-KO API
- Automatic creation of states
- Push of state changes to AL-KO
- WebSocket integration for real-time updates


---

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
