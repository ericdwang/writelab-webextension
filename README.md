# WriteLab Browser Extension

[WriteLab](https://www.writelab.com/) browser extension using
[WebExtensions APIs](https://wiki.mozilla.org/WebExtensions).

[![Add to Chrome](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/writelab/anngiihocjfgfidkcgjcpdblnfaodhll)
[![Add to Firefox](https://addons.cdn.mozilla.net/static/img/addons-buttons/AMO-button_1.png)](https://addons.mozilla.org/en-US/firefox/addon/writelab/)

## Developer Installation

First clone this repository somewhere on your machine, then follow these steps
for the browser you want to use:

### Chrome/Chromium

1. Go to `chrome://extensions`
2. Enable **Developer mode** in the top-right corner
3. Click **Load unpacked extension...**
4. Select the **writelab** folder

### Firefox

1. Go to `about:debugging`
2. Click **Load Temporary Add-on**
3. Select **manifest.json** in the writelab folder

## Usage

Click on any editable area (`textarea` or `contenteditable=true`), and a
WriteLab icon should show up in the bottom right corner. Click it to create a
public draft or a document for yourself if logged in.

## License

    Copyright (C) 2017 Eric Wang
    Copyright (C) 2017 WriteLab, Inc.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
