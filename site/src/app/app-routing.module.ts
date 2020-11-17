import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show/show.component';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './session/session.component';
import { SessionListComponent } from './session-list/session-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { Settings } from './../settings';


const routes: Routes = [
  {
    path: '',
    redirectTo: `/${Settings.sections[0].url}`, pathMatch: 'full'
  },
  { path: ':section', component: SessionComponent },
  { path: ':section/list', component: SessionListComponent },
  { path: ':section/:session', component: SessionComponent },
  { path: ':section/:session/:plotname', component: ShowComponent },
  { path: '**', component: PageNotFoundComponent }
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
