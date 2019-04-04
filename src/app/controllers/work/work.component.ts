import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from '../../services/electron.service';
import {DatabaseService} from '../../services/database.service';
import {Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {Attr} from '../../models/attr';

const pinCode = '1488';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit, OnDestroy {

  address: string;

  listAttr: any[] = [];

  codeCard: string;
  itemAttr: Attr = new Attr();
  quantityPass: number;
  interval: any;

  changePinCode: string = '';

  audio;

  readCode: boolean = true;
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
    this.quantityPass = 1;

    this.electronService.getAddress()
      .then(res => {
        this.address = JSON.parse(res).address;
        this.db.queryArray('CALL get_list_attr_sch(?)', this.address)
          .then(res => {
            this.getAttr(res[0].attr_id);
            this.listAttr = res;
          })
          .catch(error => {
            this.alert.onAlert('error', error.message);
          });
      })
      .catch(error => {
        this.alert.onAlert('error', error.message);
      });

    this.getAudio();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  setQuantityPass(quant) {
    this.quantityPass = quant;
  }

  newPass(code) {
    console.log(code);

    if (code === undefined) {
      this.readCode = true;
    }

    if (this.quantityPass && code && this.codeCard !== code && this.readCode) {
      this.readCode = false;
      this.codeCard = code;
      this.db.query('CALL pass(?,?,?)', [this.codeCard, this.itemAttr.id, this.quantityPass])
        .then(res => {
          this.quantityPass = 1;
          this.clearCode();
          if (res['status'] === 1) {
            this.audioPlay();
            this.alert.onAlert('success', 'Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 2) {
            this.alert.onAlert('error', 'Аттракцион не найден. Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 3) {
            this.alert.onAlert('error', 'Недостаточно средств. Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 4) {
            this.alert.onAlert('error', 'Карта не заведена. Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 5) {
            this.alert.onAlert('error', 'Цена не найдена или некорректная. Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 6) {
            this.alert.onAlert('error', 'Проход запрещен(тип:проверка баланса). Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 7) {
            this.alert.onAlert('error', 'Карта заблокирована. Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          } else if (res['status'] === 8) {
            this.alert.onAlert('error', 'Ошибка БД. Остаток на карте: ' + res['money_n'] + 'руб' + ', ' + res['money_b'] + 'бон');
          }
        })
        .catch(err => {
          this.quantityPass = 1;
          this.alert.onAlert('error', err.message);
        });
    }
  }

  getAttr(id) {
    this.db.query('CALL get_info_atr(?)', id)
      .then(res => {
        this.itemAttr = {
          id: res['atr_id'],
          name: res['display_name'],
          price: res['price'],
          bonus: res['bonus']
        };
      })
      .catch(err => {
        this.alert.onAlert('error', err.message);
      });
  }

  getAudio() {
    this.electronService.getAudio()
      .then(res => {
        this.audio = res;
      })
      .catch(err => {
        this.alert.onAlert('error', err.message);
      });

  }

  clearPin() {
    this.changePinCode = '';
  }

  clearCode() {
    setTimeout(() => {
      this.codeCard = null;
    }, 4000);
  }

  inputPin(number) {
    this.changePinCode = this.changePinCode + number.toString();

    if (this.changePinCode.length <= 4) {
      if (this.changePinCode === pinCode) {
        this.router.navigate(['setting']);
      }
    } else {
      this.changePinCode = '';
    }
  }

  audioPlay() {
    let audio = <HTMLAudioElement>document.getElementById('audio');
    audio.play();
  }

  nextAttr(value) {
    if (value === '+') {
      let attr = this.listAttr.find(x => x.attr_id === this.itemAttr.id);
      let index: number = this.listAttr.indexOf(attr);
      if (+(this.listAttr.length - 1) > index) {
        this.getAttr(this.listAttr[index + 1].attr_id);
      } else {
        this.getAttr(this.listAttr[0].attr_id);
      }
    }

    if (value === '-') {
      let attr = this.listAttr.find(x => x.attr_id === this.itemAttr.id);
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
