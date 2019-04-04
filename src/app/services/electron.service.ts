import {Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private ipc: IpcRenderer;

  constructor() {
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  async getCode() {
    return new Promise<string>((resolve, reject) => {
      this.ipc.once('codeCard', (event, arg) => {
        if (arg.code) {
          resolve(this.hashCode(arg.code));
        } else {
          reject();
        }
      });
      this.ipc.send('codeCard');
    });
  }

  hashCode(code) {
    let codeHash: string;
    codeHash = '';
    for (let i = 0; code.length > i; i++) {
      codeHash = codeHash + (code[i].toString(16).length === 1 ? '0' + code[i].toString(16) : code[i].toString(16));
    }
    return codeHash.toUpperCase();
  }

  async getWiFi() {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('wi-fi', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('wi-fi');
    });
  }

  async restartInterface() {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('restartInterface', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('restartInterface');
    });
  }

  async connectWiFi(dataConnect) {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('connect', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('connect', dataConnect);
    });
  }

  async disconnectWiFi() {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('disconnect', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('disconnect');
    });
  }

  async getAudio() {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('getAudio', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getAudio');
    });
  }

  async setIp(ipConfig) {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('setIp', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('setIp', ipConfig);
    });
  }

  async getIp() {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('getIp', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('getIp');
    });
  }

  async getAddress() {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('readAddress', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('readAddress');
    });
  }

  async setAddress(address) {
    return new Promise<any>((resolve, reject) => {
      this.ipc.once('writeAddress', (event, arg) => {
        resolve(arg);
      });
      this.ipc.send('writeAddress', JSON.stringify(address));
    });
  }

}
