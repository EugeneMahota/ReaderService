import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../services/electron.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-ip-address',
  templateUrl: './ip-address.component.html',
  styleUrls: ['./ip-address.component.scss']
})
export class IpAddressComponent implements OnInit {

  ipConfig = {
    ip: '',
    netmask: '255.255.255.0',
    gateway: '192.168.252.1'
  };

  ipAdress: string;

  constructor(private electronService: ElectronService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.electronService.getIp()
      .then(res => {
        console.log(res);
        this.ipAdress = res['eth0'][0]['address'];
      })
      .catch(error => {
        this.alertService.onAlert('error', error.message);
      });
  }

  inputIp(value) {
    this.ipAdress = this.ipAdress + value;
  }

  setIp() {
    this.ipConfig.ip = this.ipAdress;
    this.electronService.setIp(this.ipConfig)
      .then(res => {
        this.alertService.onAlert('warning', res);
      })
      .catch(err => {
        this.alertService.onAlert('error', err.message);
      });
  }

  clearIp() {
    this.ipAdress = this.ipAdress.substring(0, this.ipAdress.length - 1);
  }
}
