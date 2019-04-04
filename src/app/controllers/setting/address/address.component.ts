import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../services/electron.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  address: string = '';

  constructor(private electronService: ElectronService, private alert: AlertService) {
  }

  ngOnInit() {
    this.electronService.getAddress()
      .then(res => {
        this.address = JSON.parse(res).address;
      })
      .catch(error => {
        this.alert.onAlert('error', error.message);
      });
  }

  setAddress() {
    this.electronService.setAddress({address: this.address})
      .then(res => {
        if (res) {
          this.alert.onAlert('error', res);
        } else {
          this.alert.onAlert('success', 'Адрес изменен!');
        }
      })
      .catch(error => {
        this.alert.onAlert('error', error.message);
      });
  }

  inputAddress(value) {
    this.address = this.address + value;
  }

  clearAddress() {
    this.address = this.address.substring(0, this.address.length - 1);
  }
}
