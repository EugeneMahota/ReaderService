import {EventEmitter, Injectable} from '@angular/core';
import {IpcRenderer} from 'electron';


@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  private ipc: IpcRenderer;

  code: EventEmitter<string> = new EventEmitter<string>();

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


    this.getCode()
      .then()
      .catch();
  }

  async getCode() {
    return new Promise<any>((resolve, reject) => {
      setInterval(() => {
        this.ipc.once('codeCardResponse', (event, arg) => {
          if (arg.code) {
            let code: string;
            code = '';
            for (let i = 0; arg.code.length > i; i++) {
              code = code + (arg.code[i].toString(16).length === 1 ? '0' + arg.code[i].toString(16) : arg.code[i].toString(16));
            }
            this.code.emit(code);
            resolve(arg);
          }
        });
        this.ipc.send('codeCard');
      }, 200);
    });
  }


}
