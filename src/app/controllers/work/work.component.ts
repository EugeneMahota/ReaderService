import {Component, OnInit} from '@angular/core';
import {ElectronService} from '../../services/electron.service';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {

  codeCard: string;
  attrId: number;
  quantityPass: number;


  constructor(private electronService: ElectronService, private db: DatabaseService) {
    this.electronService.code.subscribe(code => {
      this.newPass(code);
    });
  }

  ngOnInit() {
    this.attrId = 1449;
  }

  setQuantityPass(quant) {
    this.quantityPass = quant;
  }

  newPass(code) {
    this.codeCard = code;

    console.log(code);
    if (this.quantityPass && this.codeCard) {
      this.db.query('CALL pass(?,?,?)', [this.codeCard.toUpperCase(), this.attrId, this.quantityPass])
        .then(res => {
          this.quantityPass = null;
          console.log(res);
        })
        .catch(res => {
          this.quantityPass = null;
          console.log(res);
        });
    }
  }
}
