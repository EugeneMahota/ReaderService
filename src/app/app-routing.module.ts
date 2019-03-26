import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {WorkComponent} from './controllers/work/work.component';
import {SettingComponent} from './controllers/setting/setting.component';

const routes: Routes = [
  {path: '', redirectTo: 'work', pathMatch: 'full'},

  {path: 'work', component: WorkComponent},
  {path: 'setting', component: SettingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
