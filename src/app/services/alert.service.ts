import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

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
    }, 2000);
  }

  delAlert() {
    this.type.emit(null);
    this.message.emit(null);
  }
}
