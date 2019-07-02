import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from '../../services/electron.service';
import {DatabaseService} from '../../services/database.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';

const pinCode = '1488';
const pinCodeReboot = '2703';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit, OnDestroy {

  address: string;

  listAttr: any[] = [];
  activeAttr: any = {atr_id: 0, display_name: '', fl_bonus: 0};

  codeCard: string;
  interval: any;
  intervalUsb0: any;

  inputData: string;

  readCode: boolean = true;
  readMessage: boolean = true;

  constructor(private electronService: ElectronService,
              private db: DatabaseService,
              private router: Router,
              private alert: AlertService) {
    this.interval = setInterval(() => {
      this.electronService.getCode()
        .then(code => {
          console.log(code);
          this.newPass(code);
        })
        .catch(err => {
          this.newPass(err);
        });
    }, 500);
  }

  ngOnInit() {
    this.inputData = '';

    this.electronService.getAddress()
      .then(res => {
        this.address = JSON.parse(res).address;
        this.getListAttr(this.address);
      })
      .catch(error => {
        this.alert.onAlertList('error', error.message);
      });
    this.getUsbZ();
  }

  getUsbZ() {
    this.electronService.getDataUsbZ()
      .then(res => {
        if (res) {
          if (res.toString().length === 16) {
            console.log(res);
            this.newPass(res);
          }

          setTimeout(() => {
            this.getUsbZ();
          }, 1000);
        }
      })
      .catch(err => {
        this.alert.onAlertList('error', err.message);
      });
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  getListAttr(address) {
    this.db.queryArray('call get_list_attr_new(?)', address)
      .then(res => {
        this.listAttr = res;
        this.getAttr(this.listAttr[0].attr_id);
      })
      .catch(err => {
        this.alert.onAlertList('error', err.message);
      });
  }

  getAttr(id: number) {
    this.db.query('call get_info_attr_new(?)', id)
      .then(res => {
        this.activeAttr = res;
      })
      .catch(err => {
        this.alert.onAlertList('error', err.message);
      });
  }

  newPass(code) {
    if (code !== undefined && this.inputData === '' && this.readMessage) {
      this.alert.onAlertList('error', 'Введите сумму для оплаты!');
      this.readMessage = false;
      this.clearMessage();
    }

    if (code === undefined) {
      this.readCode = true;
    }

    if (+this.inputData && this.inputData !== '' && code && this.codeCard !== code && this.readCode) {
      this.readCode = false;
      this.readMessage = false;
      this.clearMessage();
      this.codeCard = code;
      this.db.query('CALL pay_bar(?,?,?)', [this.codeCard, this.activeAttr.atr_id, this.inputData])
        .then(res => {
          this.clearCode();
          if (res['status'] === 1) {
            this.onAlert('success', 'Деньги списаны.', this.activeAttr.fl_bonus, res['money_n'], res['money_b'], res['deposit']);
          } else if (res['status'] === 2) {
            this.onAlert('error', 'Неверный тип считывателя.', this.activeAttr.fl_bonus, res['money_n'], res['money_b'], res['deposit']);
          } else if (res['status'] === 3) {
            this.onAlert('error', 'Депозит исчерпан.', this.activeAttr.fl_bonus, res['money_n'], res['money_b'], res['deposit']);
          } else if (res['status'] === 4) {
            this.onAlert('error', 'Недостаточно средств.', this.activeAttr.fl_bonus, res['money_n'], res['money_b'], res['deposit']);
          } else if (res['status'] === 5) {
            this.onAlert('error', 'Ошибка БД.', this.activeAttr.fl_bonus, res['money_n'], res['money_b'], res['deposit']);
          } else {
            this.alert.onAlert('error', 'Неизвестная ошибка!');
          }
          this.inputData = '';
        })
        .catch(err => {
          this.inputData = '';
          this.alert.onAlertList('error', err.message);
        });
    }
  }

  onAlert(type: string, message: string, fl_bonus: number, money: number, bonus: number, deposit: number) {
    if (fl_bonus) {
      this.alert.onAlertList(type, message + ' ' + 'Остаток на карте: ' + money + 'руб, ' + bonus + 'бон' + (deposit ? '. Депозит: ' + deposit + 'руб' : ''));
    } else {
      this.alert.onAlertList(type, message + ' ' + 'Остаток на карте: ' + money + 'руб ' + (deposit ? '. Депозит: ' + deposit + 'руб' : ''));
    }
  }

  clearSum() {
    this.inputData = this.inputData.substring(0, this.inputData.length - 1);
  }

  clearCode() {
    setTimeout(() => {
      this.codeCard = null;
    }, 4000);
  }

  clearMessage() {
    setTimeout(() => {
      this.readMessage = true;
    }, 4000);
  }

  inputSum(number) {
    this.inputData = this.inputData + number.toString();

    if (this.inputData.length <= 4) {
      if (this.inputData === pinCode) {
        this.router.navigate(['setting']);
      }
      if (this.inputData === pinCodeReboot) {
        this.electronService.reboot();
      }
    }
  }

  nextAttr(value) {
    if (value === '+') {
      let attr = this.listAttr.find(x => x.attr_id === this.activeAttr.atr_id);
      let index: number = this.listAttr.indexOf(attr);
      if (+(this.listAttr.length - 1) > index) {
        this.getAttr(this.listAttr[index + 1].attr_id);
      } else {
        this.getAttr(this.listAttr[0].attr_id);
      }
    }

    if (value === '-') {
      let attr = this.listAttr.find(x => x.attr_id === this.activeAttr.atr_id);
      let index: number = this.listAttr.indexOf(attr);
      if (index > 0) {
        this.getAttr(this.listAttr[index - 1].attr_id);
      } else {
        let last_index = this.listAttr.length - 1;
        this.getAttr(this.listAttr[last_index].attr_id);
      }
    }
  }

}
