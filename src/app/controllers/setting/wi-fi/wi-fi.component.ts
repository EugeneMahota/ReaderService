import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../services/electron.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-wi-fi',
  templateUrl: './wi-fi.component.html',
  styleUrls: ['./wi-fi.component.scss']
})
export class WiFiComponent implements OnInit {

  listWiFi: any[] = [];

  constructor(private electronService: ElectronService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.electronService.getWiFi()
      .then(res => {
        this.listWiFi = res;
      })
      .catch(err => {
        this.alertService.onAlertList('error', err.message);
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
