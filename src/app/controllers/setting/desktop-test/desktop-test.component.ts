import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-desktop-test',
  templateUrl: './desktop-test.component.html',
  styleUrls: ['./desktop-test.component.scss']
})
export class DesktopTestComponent implements OnInit {

  color: string = 'red';

  constructor(private router: Router) {
  }

  ngOnInit() {
    setInterval(() => {
      if (this.color === 'red') {
        this.color = 'green';
      } else if (this.color === 'green') {
        this.color = 'blue';
      } else if (this.color === 'blue') {
        this.color = 'red';
      }
    }, 3000);
    setTimeout(() => {
      this.router.navigate(['setting']);
    }, 10000);
  }

}
