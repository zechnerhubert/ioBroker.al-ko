![Logo](admin/al-ko.png)
# ioBroker.al-ko

[![NPM version](https://img.shields.io/npm/v/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
[![Downloads](https://img.shields.io/npm/dm/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
![Number of Installations](https://iobroker.live/badges/al-ko-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/al-ko-stable.svg)

![NPM](https://nodei.co/npm/iobroker.al-ko.png?downloads=true)

## Overview

The ioBroker.al-ko adapter integrates **AL-KO Robolinho robotic lawnmowers** and other AL-KO smart garden devices into ioBroker using the official **AL-KO Cloud API**, including real-time updates via WebSocket.

This adapter is a **community project** and is **not affiliated with or supported by AL-KO**.

---

## Features

- Connects to the official AL-KO Cloud API  
- Automatically creates all readable states  
- Writable states controlled through a whitelist  
- Sends state changes back to AL-KO (`desired` state API)  
- Real-time updates via WebSocket  
- Supports multiple devices  
- Works with the newest ioBroker admin/jsonConfig format  

---

## Requirements

You need AL-KO API credentials, which can be requested here:

➡ https://alko-garden.at/iot-api-zugang-anfordern/

Adapter settings in Admin:

- Username (AL-KO account)
- Password
- Client ID
- Client Secret

---

## Disclaimer

This adapter is **not** affiliated with or supported by AL-KO.  
Do **not** contact AL-KO customer service regarding this project.

---

## Latest Changes

### **0.2.16 (unreleased / development)**
- Improved instance handling and object hierarchy
- Better separation of writable and non-writable states
- Added axios global timeout
- Introduced adapter-safe timers (`this.setTimeout`, `this.setInterval`)
- Many internal improvements and preparations for future patches

### **0.2.15 (2025-11-02)**
- Cleaned up admin/jsonConfig structure for adapter-check
- Added missing `size` attributes
- Added `.commitinfo` to `.gitignore`
- No functional changes

➡ **Full changelog here:**  
**[CHANGELOG.md](./CHANGELOG.md)**

---

## License

This project is released under the **MIT License**.  
See the included **LICENSE** file for full details.
