import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {Settings} from './../settings';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {SessionListComponent} from './session-list/session-list.component';
import {SessionComponent} from './session/session.component';
import {ShowComponent} from './show/show.component';
import {StartscreenComponent} from './startscreen/startscreen.component';


const routes: Routes = [
  {path: '', component: StartscreenComponent, pathMatch: 'full'},
  {path: ':section', component: SessionComponent},
  {path: ':section/list', component: SessionListComponent},
  {path: ':section/:session', component: SessionComponent},
  {path: ':section/:session/:plotname', component: ShowComponent},
  {path: '**', component: PageNotFoundComponent}
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, {useHash: true}), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
