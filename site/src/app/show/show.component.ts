import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Plot } from '../classes/types';

import { decodeSessionURI } from '../utils';
import { DataService } from '../services/data.service';
import { flatMap, filter } from 'rxjs/operators';
import { Settings } from './../../settings';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class ShowComponent implements OnInit {

  plot: Plot | null = null;
  baddata = false;
  constructor(private activateRoute: ActivatedRoute, private dataServ: DataService) {
    let session: string;
    let name: string;
    let section = Settings.sections[0];
    this.activateRoute.params.pipe(
      filter(params => {
        const s = Settings.sections.find(sess => sess.url === params.section);
        if (s) {
          section = s;
        }
        session = decodeSessionURI(params.session);
        name = params.plotname;
        if (!name || !session || !section) {
          console.error('bad');
          this.baddata = true;
          return false;
        }
        return true;
      }),
      flatMap(params => {
        // section is explicitly defined due to filter
        return this.dataServ.get(section);
      })
    ).subscribe(cache => {
      this.baddata = false;
      const plot = cache.plots.find((item: Plot) => item.session === session && item.name === name);
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
