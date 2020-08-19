import { Component, OnInit, Input } from '@angular/core';
import { Plot } from '../classes/types';

@Component({
  selector: 'app-plot-card',
  templateUrl: './plot-card.component.html',
  styleUrls: ['./plot-card.component.css']
})
export class PlotCardComponent implements OnInit {

  @Input() plot: Plot;
  constructor() { }

  ngOnInit(): void {
  }

  url(): string {
    return "assets/content/" + this.plot.png;
  }

  url_pdf(): string {
    return "assets/content/" + this.plot.pdf;
  }

  header(): string {
    return this.plot.title;
  }

  content(): string {
    return this.plot.comment;
  }

  date(): string {
    // TODO: add date
    return "18-01-2020";
  }
}
