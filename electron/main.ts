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

  // win.webContents.openDevTools();

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
    // nodeCmd.get('reboot', () => {
    // });
  });
});

ipcMain.on('readAddress', (event, arg) => {
  fs.readFile(__dirname + '/public/address', (err, result) => {
    if (err) {
      event.sender.send('readAddress', err);
    } else {
      event.sender.send('readAddress', result);
    }
  });
});

ipcMain.on('writeAddress', (event, arg) => {
  fs.writeFile(__dirname + '/public/address', arg, (err) => {
    event.sender.send('writeAddress', err);
  });
});

ipcMain.on('temperature', (event, arg) => {
  nodeCmd.get('vcgencmd measure_temp', (err, data) => {
    event.sender.send('temperature', data);
  });
});
