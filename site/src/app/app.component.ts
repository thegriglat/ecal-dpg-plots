import { Component } from '@angular/core';

import * as data from './../data.json'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'site';

  getPlotsURLS() {
    return data.plots.map(e => "/assets/content/" + e.png);
  }
}
