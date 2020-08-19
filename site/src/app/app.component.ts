import { Component } from '@angular/core';

import { Plot } from './classes/types';

import * as data from './../data.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'site';

  public getPlots(): Plot[] {
    return data.plots as Plot[];
  }


}
