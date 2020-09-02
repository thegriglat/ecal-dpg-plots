import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Plot } from '../classes/types';

import { saveAs } from 'file-saver';
import { Animations } from '../classes/animation';
import { encodeSessionURI } from '../utils';
import { SuiModalService } from '@richardlt/ng2-semantic-ui';
import { PlotModal } from '../plot-card-modal/plot-card-modal.component';

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

  @Input() plot!: Plot;
  @Input() minified = true;
  @Input() tags: string[] = [];
  @Input() collapsed = false;
  @Output() session = new EventEmitter<string>();
  @Output() tag = new EventEmitter<string>();

  isLoaded = false;

  constructor(private modalService: SuiModalService) { }

  ngOnInit(): void {
  }

  url(format?: string): string {
    const fmt = (format) ? format : 'png';
    let plotUrl = '';
    switch (fmt) {
      case 'png': {
        plotUrl = this.plot.png;
        break;
      }
      case 'pdf': {
        plotUrl = this.plot.pdf || '';
        break;
      }
      case 'jpg': {
        plotUrl = this.plot.jpg || '';
        break;
      }
      case 'root': {
        plotUrl = this.plot.root || '';
        break;
      }
      default: {
        plotUrl = this.plot.png;
      }
    }
    return 'assets/content/' + plotUrl;
  }

  titleSet(): boolean {
    return this.plot.title !== 'notitle';
  }

  header(): string {
    return this.plot.title;
  }

  captions(): string[] {
    return this.plot.caption.split('\n');
  }

  date(): string {
    return this.plot.date;
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
    return `show/${encodeSessionURI(this.plot.session)}/${this.plot.name}`;
  }

  showModal(): void {
    this.modalService.open(
      new PlotModal(this.plot)
    );
  }

  setLoad(isLoaded: boolean): void {
    this.isLoaded = true;
  }
}
