import { Component, OnInit } from '@angular/core';
import {AlertService} from '../../services/alert.service';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('alert', [
      state('void', style({
        opacity: 0,
        marginLeft: '-300px'
      })),
      state('*', style({
        opacity: 1,
        marginLeft: 0
      })),
      transition('void=>*, *=>void', animate('400ms ease-in-out'))
    ])
  ]
})
export class AlertComponent implements OnInit {

  type: string;
  message: string;

  listAlert: any[] = [];
  constructor(private alertService: AlertService) {
    this.alertService.type.subscribe(type => this.type = type);
    this.alertService.message.subscribe(message => this.message = message);

    this.alertService.listAlertEvent.subscribe(list => this.listAlert = list.reverse());
  }

  ngOnInit() {
  }

  delAlert() {
    this.alertService.delAlert();
  }

  delAlertItem() {
    this.alertService.delAlertItem();
  }

}
