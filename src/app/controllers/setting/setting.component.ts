import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../services/electron.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  listWiFi: any[] = [];

  constructor(private electronService: ElectronService) {
  }

  ngOnInit() {
    this.electronService.getWiFi()
      .then(res => {
        this.listWiFi = res;
        console.log(res);
      })
      .catch(res => {
        console.log(res);
      });
  }

}
