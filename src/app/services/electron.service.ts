import {EventEmitter, Injectable} from '@angular/core';
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

}
