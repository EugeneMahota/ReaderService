import {app, BrowserWindow, ipcMain} from 'electron';
import {init} from 'raspi';
import {OneWire} from 'raspi-onewire';
const piWifi = require('pi-wifi');
import * as path from 'path';
import * as url from 'url';

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
    event.sender.send('codeCard', {code: devices[1], err: err});
  });
});

ipcMain.on('wi-fi', (event, arg) => {
  piWifi.scan((err, networks) => {
    event.sender.send('wi-fi', networks);
  });
});
