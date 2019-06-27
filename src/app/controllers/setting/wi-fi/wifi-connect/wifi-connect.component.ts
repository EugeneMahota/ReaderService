import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../../../services/electron.service';
import {AlertService} from '../../../../services/alert.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-wifi-connect',
  templateUrl: './wifi-connect.component.html',
  styleUrls: ['./wifi-connect.component.scss']
})
export class WifiConnectComponent implements OnInit {

  number = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  keyboardOne = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
  keyboardTwo = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
  keyboardThree = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

  dataConnect = {
    ssid: '',
    username: 'raspberryPi',
    password: ''
  };

  upperCase: boolean = false;

  constructor(private electronService: ElectronService, private alertService: AlertService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.dataConnect.ssid = this.route.snapshot.paramMap.get('ssid');
  }

  connectTo() {
    this.electronService.connectWiFi(this.dataConnect)
      .then(res => {
        this.alertService.onAlert('success', 'Подключен!');
        if (res) {
          this.alertService.onAlert('error', res);
        }
      })
      .catch(err => {
        this.alertService.onAlert('error', err.message);
      });
  }

  inputPassword(value) {
    this.dataConnect.password = this.dataConnect.password + value;
  }

  clearPassword() {
    this.dataConnect.password = this.dataConnect.password.substring(0, this.dataConnect.password.length - 1);
  }
}
