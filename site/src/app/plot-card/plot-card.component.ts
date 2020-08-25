import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Plot } from '../classes/types';

import { saveAs } from 'file-saver';
import { Animations } from '../classes/animation';

@Component({
  selector: 'app-plot-card',
  templateUrl: './plot-card.component.html',
  styleUrls: ['./plot-card.component.css'],
  animations: [
    Animations.verticalSlideTop,
    Animations.verticalSlideDown
  ]
})
export class PlotCardComponent implements OnInit {

  @Input() plot: Plot;
  @Input() minified = true;
  @Input() tags: string[] = [];
  @Input() collapsed;
  @Output() session = new EventEmitter<string>();
  @Output() tag = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  url(format?: string): string {
    const fmt = (format) ? format : 'png';
    return 'assets/content/' + this.plot[fmt];
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

  icontype(fmt: string): string {
    if (String(fmt) === 'pdf') { return 'file pdf'; }
    if (String(fmt) === 'png') { return 'image'; }
    if (String(fmt) === 'jpg') { return 'file image outline'; }
    if (String(fmt) === 'root') { return 'file'; }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  isCollapsed(): boolean {
    return this.collapsed;
  }

  save(url: string): void {
    const urlc = url.split('/');
    saveAs(url, urlc[urlc.length - 1]);
  }

  getSession(): string {
    return this.plot.session;
  }

  setSession(): void {
    this.session.emit(this.plot.session);
  }

  setTag(tag: string): void {
    this.tag.emit(tag);
  }

  getTagClass(tag: string): string {
    if (this.tags.indexOf(tag) !== -1) {
      return 'blue';
    }
    return 'gray';
  }

  isTagChecked(tag: string): boolean {
    return this.tags.indexOf(tag) !== -1;
  }

  getPermalink(): string {
    return '/show/' + this.plot.shorturl;
  }
}
