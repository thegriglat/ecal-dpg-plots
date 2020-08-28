import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DataService } from './services/data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
  }

  constructor(private dataServ: DataService) { }

  jsonReady(): boolean {
    return this.dataServ.done();
  }

}
