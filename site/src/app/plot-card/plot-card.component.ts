import { Component, OnInit, Input } from '@angular/core';
import { Plot, Formats } from '../classes/types';

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

  url(format?: Formats): string {
    let fmt = (format) ? format : "png";
    return "assets/content/" + this.plot[fmt];
  }

  header(): string {
    return this.plot.title;
  }

  content(): string {
    return this.plot.comment;
  }

  date(): string {
    return this.plot.date;
  }

  icontype(fmt: Formats): string {
    if (String(fmt) === "pdf") return "file pdf";
    if (String(fmt === "png")) return "image";
    if (String(fmt === "jpg")) return "file image outline";
    if (String(fmt === "root")) return "file";
  }
}
