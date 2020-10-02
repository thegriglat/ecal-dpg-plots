import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show/show.component';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './session/session.component';
import { SessionShowProxyComponent } from './session-show-proxy/session-show-proxy.component';
import { SessionListComponent } from './session-list/session-list.component';


const routes: Routes = [
  {
    path: '',
    component: SessionComponent
  },
  { path: 'show/:section/:session/:plotname', component: ShowComponent },
  { path: 'show/:section/:session', component: SessionShowProxyComponent },
  { path: 'show/:section', component: SessionShowProxyComponent },
  { path: 'sessions/:section', component: SessionListComponent },
  { path: '**', component: SessionComponent }

];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true }),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
