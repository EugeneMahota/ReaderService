import {app, BrowserWindow, ipcMain} from 'electron';
import {init} from 'raspi';
import {OneWire} from 'raspi-onewire';

import * as path from 'path';
import * as url from 'url';

const os = require('os');
const networkInterfaces = os.networkInterfaces();
const fs = require('fs');
const piWifi = require('pi-wifi');
const network = require('network-config');
const nodeCmd = require('node-cmd');

let win: BrowserWindow;


app.on('ready', createWindow);

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function createWindow() {
  win = new BrowserWindow({fullscreen: true});

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/ServiceTs/index.html`),
      protocol: 'file:',
      slashes: true
    })
  );

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

ipcMain.on('codeCard', (event, arg) => {
  const bus = new OneWire();
  bus.searchForDevices((err, devices) => {
    if (!err) {
      if (devices[1]) {
        event.sender.send('codeCard', {code: devices[1], err: err});
      } else {
        event.sender.send('codeCard', {code: undefined, err: err});
      }
    }
  });
});

ipcMain.on('wi-fi', (event, arg) => {
  piWifi.scan((err, networks) => {
    if (!err) {
      event.sender.send('wi-fi', networks);
    }
  });
});

ipcMain.on('connect', (event, arg) => {
  piWifi.connect(arg.ssid, arg.password, function (err) {
    if (err) {
      event.sender.send('connect', err.message);
    }
  });
});

ipcMain.on('disconnect', (event, arg) => {
  piWifi.disconnect(function (err) {
    if (err) {
      event.sender.send('disconnect', err.message);
    }
  });
});

ipcMain.on('readFile', (event, arg) => {
  event.sender.send('readFile', 'file:///' + __dirname + '/public/audio.mp3');
});

ipcMain.on('getIp', (event, arg) => {
  event.sender.send('getIp', networkInterfaces);
});

ipcMain.on('setIp', (event, arg) => {
  network.configure('eth0', arg, (err) => {
    event.sender.send('setIp', err);
    nodeCmd.get('reboot', () => {
    });
  });
});

ipcMain.on('readAddress', (event, arg) => {
  fs.readFile(__dirname + '/public/address.json', (err, result) => {
    if (err) {
      event.sender.send('readAddress', err);
    } else {
      event.sender.send('readAddress', result);
    }
  });
});

ipcMain.on('writeAddress', (event, arg) => {
  fs.writeFile(__dirname + '/public/address.json', arg, (err) => {
    event.sender.send('writeAddress', err);
  });
});

ipcMain.on('temperature', (event, arg) => {
  nodeCmd.get('vcgencmd measure_temp', (err, data) => {
    event.sender.send('temperature', data);
  });
});

ipcMain.on('reboot', (event, arg) => {
  nodeCmd.get('reboot', () => {
    event.sender.send('reboot', '');
  });
});


const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: '\n'
});

const port = new SerialPort('/dev/ttyUSB0');

port.pipe(parser);

port.on('open', function () {
});


ipcMain.on('usbZ', (event, arg) => {
  parser.on('data', function (data) {
    if (data.toString() !== 'No card') {
      event.sender.send('usbZ', hashCodeUsbZ(data.toString()));
    }
  });
});

const hashCodeUsbZ = (code) => {
  let codeHash: string;
  let strOne: any;
  let strTwo: any;
  let strThree: string;

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

const addZero = (str) => {
  if (str.length === 1) {
    return '000' + str;
  } else if (str.length === 2) {
    return '00' + str;
  } else if (str.length === 3) {
    return '0' + str;
  } else {
    return str;
  }
};

const replaceStr = (str) => {
  let strOne: string = str.slice(0, 2);
  let strTwo: string = str.slice(2, 5);

  return strTwo + strOne;
};

const controlSum = (code) => {
  let crc = 0;

  for (let i = 0; code.length > i; i += 2) {
    let data: number = parseInt(code.slice(i, i + 2), 16);

    for (let j = 0; 8 > j; j++) {
      let mix = (crc ^ data) & 0x01;
      crc = crc >> 1;
      if (mix) crc ^= 0x8C;
      data = data >> 1;
    }
  }

  return crc.toString(16);
};
