import { Component, OnInit } from '@angular/core';

import { DataService } from './../services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private dataServ: DataService) { }

  ngOnInit(): void {
  }

  giturl(): string {
    return 'https://gitlab.cern.ch/ECALPFG/ecaldpgplots/-/tree/' + this.dataServ.get().commit;
  }

  date(): string {
    return this.dataServ.get().builddate;
  }

}
