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
  constructor(private activateRoute: ActivatedRoute, private dataServ: DataService) {
    this.activateRoute.params.subscribe(params => {
      const session = decodeSessionURI(params.session);
      const name = params.plotname;
      const plot = this.dataServ.get().plots.find((item: Plot) => item.session === session && item.name === name) as Plot;
      if (plot) {
        this.plot = plot;
      }
    });
  }

  ngOnInit(): void {
  }

}
