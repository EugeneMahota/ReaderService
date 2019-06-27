import {Component, OnDestroy, OnInit} from '@angular/core';
import {ElectronService} from '../../../services/electron.service';
import {interval, Observable, pipe} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.scss']
})
export class TempComponent implements OnInit, OnDestroy {

  temp: string;
  intervalTemp: any;

  observer: any;

  listBlock: any[] = [];

  constructor(private electronService: ElectronService, private http: HttpClient) {
  }

  ngOnInit() {
    this.getTemp();
  }

  ngOnDestroy() {
    clearInterval(this.intervalTemp);
    this.unsubscribe();
  }


  getTemp() {
    this.intervalTemp = setInterval(() => {
      this.electronService.getTemp()
        .then(res => {
          console.log(res);
          this.temp = res.toString().replace('temp=', '');
        });
    }, 1000);
  }

  subscribe() {
    this.observer = this.getNews().subscribe(res => {
      this.listBlock = this.listBlock.reverse();
      this.listBlock.push(res);
    });
  }

  unsubscribe() {
    this.listBlock = [];
    this.observer.unsubscribe();
  }

  getNews(): Observable<any> {
    return interval(500).pipe(flatMap(() => {
      return new Observable((observer) => {
        let number = Math.random();
        observer.next(number);
      });
    }));
  }

}
