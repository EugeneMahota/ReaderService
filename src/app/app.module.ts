import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SettingComponent } from './controllers/setting/setting.component';
import { WorkComponent } from './controllers/work/work.component';
import { AlertComponent } from './components/alert/alert.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { WiFiComponent } from './controllers/setting/wi-fi/wi-fi.component';
import { IpAddressComponent } from './controllers/setting/ip-address/ip-address.component';
import {FormsModule} from '@angular/forms';
import { AddressComponent } from './controllers/setting/address/address.component';

@NgModule({
  declarations: [
    AppComponent,
    SettingComponent,
    WorkComponent,
    AlertComponent,
    WiFiComponent,
    IpAddressComponent,
    AddressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
