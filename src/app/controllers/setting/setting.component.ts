import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {

  }

  onBack() {
    this.router.navigate(['work']);
  }

  scrollMenu(value) {
    let menu = document.getElementById('menu');
    if (value) {
      menu.scrollBy({left: 100, behavior: 'smooth'});
    }
    if (!value) {
      menu.scrollBy({left: -100, behavior: 'smooth'});
    }
  }
}
