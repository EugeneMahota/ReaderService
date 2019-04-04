import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WorkComponent} from './controllers/work/work.component';
import {SettingComponent} from './controllers/setting/setting.component';
import {WiFiComponent} from './controllers/setting/wi-fi/wi-fi.component';
import {IpAddressComponent} from './controllers/setting/ip-address/ip-address.component';
import {AddressComponent} from './controllers/setting/address/address.component';

const routes: Routes = [
  {path: '', redirectTo: 'work', pathMatch: 'full'},

  {path: 'work', component: WorkComponent},
  {path: 'setting', component: SettingComponent, children: [

      {path: '', redirectTo: 'wi-fi', pathMatch: 'full'},

      {path: 'ip-address', component: IpAddressComponent},
      {path: 'address', component: AddressComponent},
      {path: 'wi-fi', component: WiFiComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
