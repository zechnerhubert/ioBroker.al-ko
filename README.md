![Logo](admin/al-ko.png)
# ioBroker.al-ko

[![NPM version](https://img.shields.io/npm/v/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
[![Downloads](https://img.shields.io/npm/dm/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
![Number of Installations](https://iobroker.live/badges/al-ko-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/al-ko-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.al-ko.png?downloads=true)](https://nodei.co/npm/iobroker.al-ko/)

**Tests:** ![Test and Release](https://github.com/zechnerhubert/ioBroker.al-ko/workflows/Test%20and%20Release/badge.svg)

## ioBroker.al-ko

Adapter für die Kommunikation mit AL-KO Gartengeräten.  
Adapter for communication with AL-KO garden tools.

## Beschreibung

Dieser Adapter ermöglicht die Steuerung von AL-KO Gartengeräten durch Verbindung mit der offiziellen AL-KO IoT-API.  
Die Zugangsdaten zur API müssen im Admin-Interface eingetragen werden.  
Wie diese beantragt werden können, finden Sie unter:  
👉 https://alko-garden.at/iot-api-zugang-anfordern/

Der Adapter verbindet sich mit Ihrem API-Konto und ruft alle Gerätedaten ab.  
Die aktuellen Zustände werden über WebSocket direkt von AL-KO aktualisiert.

---

This adapter enables you to control AL-KO garden tools by connecting to the official AL-KO IoT API.  
You must enter your AL-KO API login details in the admin interface.  
You can find out how to obtain these here:  
👉 https://alko-garden.at/iot-api-zugang-anfordern/

The adapter connects to your API account and retrieves all device data.  
The current states are updated via WebSocket provided by AL-KO.

---

### DISCLAIMER

Dieser Adapter steht **in keinem Zusammenhang mit der Firma AL-KO**.  
AL-KO bietet für diesen Adapter **keinen Support** an.

This adapter is **not affiliated with AL-KO**.  
AL-KO does **not provide any support** for this adapter.

---

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->

### **0.1.1 (2025-09-29)**
* Initial release

---

## License
MIT License

Copyright (c) 2025 Hubert Zechner <hubertiob@posteo.at>

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
