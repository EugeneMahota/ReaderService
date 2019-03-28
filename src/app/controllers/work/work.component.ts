import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from '../../services/electron.service';
import {DatabaseService} from '../../services/database.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit, OnDestroy {

  codeCard: string;
  attrId: number;
  quantityPass: number;

  interval: any;

  constructor(private electronService: ElectronService, private db: DatabaseService, private router: Router, private alert: AlertService) {
    this.interval = setInterval(() => {
      this.electronService.getCode()
        .then(code => {
          this.newPass(code);
        })
        .catch(err => {
          this.newPass(err);
        });
    }, 500);
  }

  ngOnInit() {
    this.attrId = 1449;
    this.quantityPass = 1;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  setQuantityPass(quant) {
    this.quantityPass = quant;
  }

  newPass(code) {
    console.log(code);

    if (this.quantityPass && code && this.codeCard !== code) {
      this.codeCard = code;
      this.db.query('CALL pass(?,?,?)', [this.codeCard, this.attrId, this.quantityPass])
        .then(res => {
          this.quantityPass = 1;
          this.clearCode();
          console.log(res);
          if (res['status'] === 1) {
            this.alert.onAlert('success', 'Успешный проход!');
          } else {
            this.alert.onAlert('error', 'Печалька!');
          }
        })
        .catch(res => {
          this.alert.onAlert('error', 'Печалька!');
          this.quantityPass = 1;
          this.alert.onAlert('error', 'Печалька!');
        });
    }
  }

  clearCode() {
    setTimeout(() => {
      this.codeCard = null;
    }, 3000);
  }

  nav() {
    this.router.navigate(['setting']);
  }
}
