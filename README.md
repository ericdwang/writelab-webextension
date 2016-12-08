# WriteLab Browser Extension

Prototype for a WriteLab browser extension using
[WebExtensions](https://wiki.mozilla.org/WebExtensions).

## Installation

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
