import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  listAlert: any[] = [];
  listAlertEvent: EventEmitter<any> = new EventEmitter<any>();
  timeoutDel: any;

  message: EventEmitter<string> = new EventEmitter<string>();
  type: EventEmitter<string> = new EventEmitter<string>();

  timeout: any;

  constructor() {
  }

  onAlert(type: string, message: string) {
    this.type.emit(type);
    this.message.emit(message);

    clearInterval(this.timeout);
    this.timeout = setTimeout(() => {
      this.delAlert();
    }, 5000);
  }

  delAlert() {
    this.type.emit(null);
    this.message.emit(null);
  }

  onAlertList(type: string, message: string) {
    this.listAlert.push({type: type, message: message});
    this.listAlertEvent.emit(this.listAlert);

    // clearInterval(this.timeoutDel);
    this.timeoutDel = setTimeout(() => {
      this.delAlertItem();
    }, 4000);
  }

  delAlertItem() {
    let index: number = this.listAlert.length;
    this.listAlert.splice(-1, 1);
    this.listAlertEvent.emit(this.listAlert);
  }
}
