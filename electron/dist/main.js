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
    win.webContents.openDevTools();
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
        nodeCmd.get('reboot', function () {
        });
    });
});
electron_1.ipcMain.on('readAddress', function (event, arg) {
    fs.readFile(__dirname + '/public/address.json', function (err, result) {
        if (err) {
            event.sender.send('readAddress', err);
        }
        else {
            event.sender.send('readAddress', result);
        }
    });
});
electron_1.ipcMain.on('writeAddress', function (event, arg) {
    fs.writeFile(__dirname + '/public/address.json', arg, function (err) {
        event.sender.send('writeAddress', err);
    });
});
electron_1.ipcMain.on('temperature', function (event, arg) {
    nodeCmd.get('vcgencmd measure_temp', function (err, data) {
        event.sender.send('temperature', data);
    });
});
electron_1.ipcMain.on('reboot', function (event, arg) {
    nodeCmd.get('reboot', function () {
        event.sender.send('reboot', '');
    });
});
var SerialPort = require('serialport');
var parsers = SerialPort.parsers;
var parser = new parsers.Readline({
    delimiter: '\n'
});
var port = new SerialPort('/dev/ttyUSB0');
port.pipe(parser);
port.on('open', function () {
});
electron_1.ipcMain.on('usbZ', function (event, arg) {
    parser.on('data', function (data) {
        if (data.toString() !== 'No card') {
            event.sender.send('usbZ', hashCodeUsbZ(data.toString()));
        }
    });
});
var hashCodeUsbZ = function (code) {
    var codeHash;
    var strOne;
    var strTwo;
    var strThree;
    strOne = +code.slice(20, 25);
    strTwo = +code.slice(16, 19);
    strThree = code.slice(10, 14);
    strOne = strOne.toString(16);
    strTwo = strTwo.toString(16);
    strOne = addZero(strOne);
    strTwo = addZero(strTwo);
    strOne = replaceStr(strOne);
    strTwo = replaceStr(strTwo);
    codeHash = '01' + strOne + strTwo + strThree;
    return codeHash.toUpperCase() + controlSum(codeHash).toUpperCase();
};
var addZero = function (str) {
    if (str.length === 1) {
        return '000' + str;
    }
    else if (str.length === 2) {
        return '00' + str;
    }
    else if (str.length === 3) {
        return '0' + str;
    }
    else {
        return str;
    }
};
var replaceStr = function (str) {
    var strOne = str.slice(0, 2);
    var strTwo = str.slice(2, 5);
    return strTwo + strOne;
};
var controlSum = function (code) {
    var crc = 0;
    for (var i = 0; code.length > i; i += 2) {
        var data = parseInt(code.slice(i, i + 2), 16);
        for (var j = 0; 8 > j; j++) {
            var mix = (crc ^ data) & 0x01;
            crc = crc >> 1;
            if (mix)
                crc ^= 0x8C;
            data = data >> 1;
        }
    }
    return crc.toString(16);
};
//# sourceMappingURL=main.js.map