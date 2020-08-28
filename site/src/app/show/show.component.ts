import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plot } from '../classes/types';

import { decodeSessionURI } from '../utils';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {

  plot: Plot = null;
  baddata = false;
  constructor(private activateRoute: ActivatedRoute, private dataServ: DataService) {
    this.dataServ.waitData(this.activateRoute.params).subscribe(params => {
      const session = decodeSessionURI(params.session);
      const name = params.plotname;
      if (!name || !session) {
        this.baddata = true;
        return;
      }
      const plot = this.dataServ.plots().find((item: Plot) => item.session === session && item.name === name) as Plot;
      if (plot) {
        this.plot = plot;
      }
      else {
        this.baddata = true;
      }
    });
  }

  ngOnInit(): void {
  }

}
