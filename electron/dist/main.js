"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var raspi_onewire_1 = require("raspi-onewire");
var path = require("path");
var url = require("url");
var os = require('os');
var networkInterfaces = os.networkInterfaces();
var fs = require('fs');
var piWifi = require('pi-wifi');
var network = require('network-config');
var nodeCmd = require('node-cmd');
var win;
electron_1.app.on('ready', createWindow);
electron_1.app.on('activate', function () {
    if (win === null) {
        createWindow();
    }
});
function createWindow() {
    win = new electron_1.BrowserWindow({ fullscreen: true });
    win.loadURL(url.format({
        pathname: path.join(__dirname, "/../../dist/ServiceTs/index.html"),
        protocol: 'file:',
        slashes: true
    }));
    // win.webContents.openDevTools();
    win.on('closed', function () {
        win = null;
    });
}
electron_1.ipcMain.on('codeCard', function (event, arg) {
    var bus = new raspi_onewire_1.OneWire();
    bus.searchForDevices(function (err, devices) {
        if (!err) {
            if (devices[1]) {
                event.sender.send('codeCard', { code: devices[1], err: err });
            }
            else {
                event.sender.send('codeCard', { code: undefined, err: err });
            }
        }
    });
});
electron_1.ipcMain.on('wi-fi', function (event, arg) {
    piWifi.scan(function (err, networks) {
        if (!err) {
            event.sender.send('wi-fi', networks);
        }
    });
});
electron_1.ipcMain.on('connect', function (event, arg) {
    piWifi.connect(arg.ssid, arg.password, function (err) {
        if (err) {
            event.sender.send('connect', err.message);
        }
    });
});
electron_1.ipcMain.on('disconnect', function (event, arg) {
    piWifi.disconnect(function (err) {
        if (err) {
            event.sender.send('disconnect', err.message);
        }
    });
});
electron_1.ipcMain.on('readFile', function (event, arg) {
    event.sender.send('readFile', 'file:///' + __dirname + '/public/audio.mp3');
});
electron_1.ipcMain.on('getIp', function (event, arg) {
    event.sender.send('getIp', networkInterfaces);
});
electron_1.ipcMain.on('setIp', function (event, arg) {
    network.configure('eth0', arg, function (err) {
        event.sender.send('setIp', err);
        // nodeCmd.get('reboot', () => {
        // });
    });
});
electron_1.ipcMain.on('readAddress', function (event, arg) {
    fs.readFile(__dirname + '/public/address', function (err, result) {
        if (err) {
            event.sender.send('readAddress', err);
        }
        else {
            event.sender.send('readAddress', result);
        }
    });
});
electron_1.ipcMain.on('writeAddress', function (event, arg) {
    fs.writeFile(__dirname + '/public/address', arg, function (err) {
        event.sender.send('writeAddress', err);
    });
});
electron_1.ipcMain.on('temperature', function (event, arg) {
    nodeCmd.get('vcgencmd measure_temp', function (err, data) {
        event.sender.send('temperature', data);
    });
});
//# sourceMappingURL=main.js.map