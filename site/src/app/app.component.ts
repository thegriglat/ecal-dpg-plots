import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { Title } from '@angular/platform-browser';
import { Settings } from './../settings';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private dataServ: DataService, private titleService: Title) {
    this.titleService.setTitle(Settings.title);
  }

  jsonReady(): boolean {
    return this.dataServ.done();
  }

}
