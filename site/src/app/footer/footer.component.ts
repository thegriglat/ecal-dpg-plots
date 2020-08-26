import { Component, OnInit } from '@angular/core';

import * as data from './../../data.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  giturl(): string {
    return 'https://gitlab.cern.ch/ECALPFG/ecaldpgplots/-/tree/' + data.commit;
  }

  date(): string {
    return data.builddate;
  }

}
