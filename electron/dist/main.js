"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var raspi_onewire_1 = require("raspi-onewire");
var path = require("path");
var url = require("url");
var win;
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({ width: 800, height: 600 });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/ServiceTs/index.html"),
        protocol: 'file:',
        slashes: true
    }));
    win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
electron_1.ipcMain.on('codeCard', function (event, arg) {
    var bus = new raspi_onewire_1.OneWire();
    bus.searchForDevices(function (err, devices) {
        win.webContents.send('codeCardResponse', { code: devices[1], err: err });
    });
});
//# sourceMappingURL=main.js.map