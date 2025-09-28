![Logo](admin/al-ko.png)
# ioBroker.al-ko

[![NPM version](https://img.shields.io/npm/v/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
[![Downloads](https://img.shields.io/npm/dm/iobroker.al-ko.svg)](https://www.npmjs.com/package/iobroker.al-ko)
![Number of Installations](https://iobroker.live/badges/al-ko-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/al-ko-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.al-ko.png?downloads=true)](https://nodei.co/npm/iobroker.al-ko/)

**Tests:** ![Test and Release](https://github.com/zechnerhubert/ioBroker.al-ko/workflows/Test%20and%20Release/badge.svg)

## al-ko adapter for ioBroker

IoBroker Adapter zur Kommunikation mit Al-Ko Gartengeräte

IoBroker adapter for communication with Al-Ko garden tools

## Adapter Beschreibung
Dieser Adapter ermöglicht die Steuerung von Al-KO Gartengeräte durch Verbindung mit der AL-KO API.
Sie müssen Ihre AL-KO API Anmeldedaten angeben. 
Wie sie diese erhalten, finden sie unter https://alko-garden.at/iot-api-zugang-anfordern/
Der Adapter verbindet sich mit Ihrem API-Konto und ruft alle Gerätedaten ab. 
Die akteuellen States werden über Websocket durch AL-KO aktualisiert.

This adapter enables you to control Al-KO garden tools by connecting to the AL-KO API.
You must enter your AL-KO API login details. 
You can find out how to obtain these at https://alko-garden.at/iot-api-zugang-anfordern/
The adapter connects to your API account and retrieves all device data. 
The current statuses are updated via Websocket by AL-KO.

### DISCLAIMER

Hiermit weise ich ausdrücklich darauf hin, das dieser Adapter in keinem zusammenhang mit der Fa. AL-KO steht und diese Firma auch keinerlei Support dafür anbietet.

I hereby expressly point out that this adapter is not affiliated with AL-KO and that this company does not offer any support for it.

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**
* Initial release

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