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
    netmask: '',
    gateway: ''
  };

  inputActive: string = 'ip';

  constructor(private electronService: ElectronService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.electronService.getIp()
      .then(res => {
        this.ipConfig.ip = res['eth0'][0]['address'];
        this.ipConfig.netmask = res['eth0'][0]['netmask'];
        this.ipConfig.gateway = res['eth0'][0]['address'].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\./g) + '1';
      })
      .catch(error => {
        this.alertService.onAlert('error', error.message);
      });
  }

  inputIp(value) {
    if (this.inputActive === 'ip') {
      this.ipConfig.ip = this.ipConfig.ip + value;
    }
    if (this.inputActive === 'netmask') {
      this.ipConfig.netmask = this.ipConfig.netmask + value;
    }
    if (this.inputActive === 'gateway') {
      this.ipConfig.gateway = this.ipConfig.gateway + value;
    }
  }

  setIp() {
    this.electronService.setIp(this.ipConfig)
      .then(res => {
        this.alertService.onAlert('warning', res);
      })
      .catch(err => {
        this.alertService.onAlert('error', err.message);
      });
  }

  clearIp() {
    if (this.inputActive === 'ip') {
      this.ipConfig.ip = this.ipConfig.ip.substring(0, this.ipConfig.ip.length - 1);
    }
    if (this.inputActive === 'netmask') {
      this.ipConfig.netmask = this.ipConfig.netmask.substring(0, this.ipConfig.netmask.length - 1);
    }
    if (this.inputActive === 'gateway') {
      this.ipConfig.gateway = this.ipConfig.gateway.substring(0, this.ipConfig.gateway.length - 1);
    }
  }

  selectedEdit(value) {
    this.inputActive = value;
  }
}
