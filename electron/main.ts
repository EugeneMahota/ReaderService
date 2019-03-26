import {app, BrowserWindow, ipcMain} from 'electron';
import {init} from 'raspi';
import {OneWire} from 'raspi-onewire';
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
  win = new BrowserWindow({width: 800, height: 600});

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
    win.webContents.send('codeCardResponse', {code: devices[1], err: err});
  });
});
