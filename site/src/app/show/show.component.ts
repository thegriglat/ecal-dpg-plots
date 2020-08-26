import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plot } from '../classes/types';

import * as data from './../../data.json';
import { decodeSessionURI } from '../utils';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {

  plot: Plot = null;
  constructor(private activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe(params => {
      const session = decodeSessionURI(params.session);
      const name = params.plotname;
      const plot = data.plots.find((item: Plot) => item.session === session && item.name === name) as Plot;
      if (plot) {
        this.plot = plot;
      }
    });
  }

  ngOnInit(): void {
  }

}
