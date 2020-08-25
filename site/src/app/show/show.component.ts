import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plot } from '../classes/types';

import * as data from './../../data.json';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {

  plot: Plot = null;
  constructor(private activateRoute: ActivatedRoute) {
    activateRoute.params.subscribe(params => {
      const plot = data.plots.find(item => item.shorturl === params.shorturl) as Plot;
      if (plot) {
        this.plot = plot;
      }
    });
  }

  ngOnInit(): void {
  }

}
