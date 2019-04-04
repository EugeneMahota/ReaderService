import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../services/electron.service';
import {Router} from '@angular/router';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-wi-fi',
  templateUrl: './wi-fi.component.html',
  styleUrls: ['./wi-fi.component.scss']
})
export class WiFiComponent implements OnInit {

  listWiFi: any[] = [];

  dataConnect = {
    ssid: '',
    username: 'raspberryPi',
    password: 'Yy12345678Oo'
  };

  constructor(private electronService: ElectronService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.electronService.getWiFi()
      .then(res => {
        console.log(res);
        this.listWiFi = res;
      })
      .catch(err => {
        this.alertService.onAlert('error', err.message);
      });
  }

  connectTo(ssid) {
    this.dataConnect.ssid = ssid;

    this.electronService.connectWiFi(this.dataConnect)
      .then(res => {
        if (res) {
          this.alertService.onAlert('error', res);
        } else {
          this.alertService.onAlert('error', 'Подключен!');
        }
      })
      .catch(err => {
        this.alertService.onAlert('error', err.message);
      });
  }

  restartInterface() {
    this.electronService.restartInterface()
      .then(res => {
        if (res) {
          this.alertService.onAlert('error', res);
        }
      })
      .catch(error => {
        this.alertService.onAlert('error', error.message);
      });
  }

  scrollTable(value) {
    let table = document.getElementById('table');
    if (value) {
      table.scrollBy({top: -100, behavior: 'smooth'});
    }
    if (!value) {
      table.scrollBy({top: 100, behavior: 'smooth'});
    }
  }

  disconnectWifi() {
    this.electronService.disconnectWiFi()
      .then(res => {
        if (res) {
          this.alertService.onAlert('error', res);
        }
      })
      .catch(error => {
        this.alertService.onAlert('error', error.message);
      });
  }
}
