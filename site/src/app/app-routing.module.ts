import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show/show.component';
import { RouterModule, Routes } from '@angular/router';
import { SessionComponent } from './session/session.component';


const routes: Routes = [
  {
    path: '',
    component: SessionComponent
  },
  { path: 'show/:session/:plotname', component: ShowComponent },
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
