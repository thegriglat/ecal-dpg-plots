import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Plot, Formats, Session } from '../classes/types';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-plot-card',
  templateUrl: './plot-card.component.html',
  styleUrls: ['./plot-card.component.css']
})
export class PlotCardComponent implements OnInit {

  @Input() plot: Plot;
  @Input() collapsed;
  @Output() sessionclick = new EventEmitter<string>();
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

  caption(): string {
    return this.plot.caption;
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

  toggleCollapse() {
    this.collapsed = !this.collapsed;
  }

  isCollapsed(): boolean {
    return this.collapsed;
  }

  save(url: string) {
    const urlc = url.split("/");
    saveAs(url, urlc[urlc.length - 1]);
  }

  session(): string {
    return this.plot.session;
  }

  setSession() {
    this.sessionclick.emit(this.plot.session);
  }
}
