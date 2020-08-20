import { Component, OnInit } from '@angular/core';

import * as data from './../../data.json';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  commit = data.commit;
  constructor() { }

  ngOnInit(): void {
  }

  giturl(commit: string): string {
    return "https://gitlab.com/ecal/ecaldpgplots/-/tree/" + commit;
  }

}
