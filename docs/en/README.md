# ioBroker.al-ko – English Documentation

![Logo](../../admin/al-ko-128.png)

## Overview

The ioBroker.al-ko adapter integrates **AL-KO Robolinho robotic mowers** and other AL-KO smart garden devices into ioBroker.  
It communicates with the official **AL-KO Cloud API**, including real-time updates via WebSockets.

---

## Features

- Connection to the official AL-KO Cloud API
- Automatic creation of all readable states
- Writable states controlled through a whitelist
- Changes to writable states are propagated back to AL-KO via the `desired` API
- Real-time updates through WebSocket
- Supports multiple devices
- Fully compatible with modern ioBroker admin/jsonConfig

---

## Requirements

To use this adapter, AL-KO API credentials are required.

Request access at:  
➡ https://alko-garden.at/iot-api-zugang-anfordern/

Required fields:

- Username
- Password
- Client ID
- Client Secret

Enter these values in Admin → Instance Settings.

---

## Disclaimer

This adapter is **not** affiliated with or supported by AL-KO.  
It is a **community-developed project**.

---

## Changes (Summary)

### 0.3.6 (2026-04-26)
- Fixed invalid state roles (`value.number` removed, correct usage of `value` and `level`)
- Fixed whitelist handling for writable states
- Improved object structure according to review feedback

### 0.3.5 (2026-03-26)

- Enable npm trusted publishing
- Fix GitHub Actions workflow warnings

See full changelog here:  
➡ [CHANGELOG_OLD.md](../../CHANGELOG_OLD.md)

Key updates:

- Internal cleanup and consistency improvements
- Improved logging, ID sanitizing and timers
- Documentation restructured

---

## License

Released under the **MIT License**.
