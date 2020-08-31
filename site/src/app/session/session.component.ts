import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Plot, Session, AnySession } from './../classes/types';
import { Animations } from './../classes/animation';

import { encodeSessionURI, decodeSessionURI } from './../utils';

import { saveAs } from 'file-saver';

import { DataService } from '../services/data.service';

const englishNumbers = [
  null,
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen'
];

// zoom level to auto enable minify
const MINIFY_LIMIT = 6;

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  animations: [
    Animations.fadeAnimation
  ]
})
export class SessionComponent implements OnInit {


  selectedTags: string[] = [];
  filter = '';
  private zoomLevel = 4;
  private currentScroll = this.zoomLevel;
  minified = false;
  session: Session = AnySession;

  ngOnInit(): void { }

  constructor(private activatedRoute: ActivatedRoute, private dataServ: DataService) {
    this.dataServ.waitData(this.activatedRoute.queryParams).subscribe(params => {
      this.reset();
      if (params.session) {
        // session provided
        const session: string = decodeSessionURI(params.session);
        const f = this.getSessions().find(item => item.session === session);
        if (f) {
          this.session = f;
        }
      }
      if (params.tags) {
        let tags: string[] = params.tags;
        if (typeof params.tags === 'string') {
          tags = [params.tags];
        }
        const allTags = this.getTags();
        for (const tag of tags) {
          if (allTags.includes(tag)) {
            this.toggleTag(tag);
          }
        }
      }
      if (params.filter) {
        this.filter = params.filter;
      }
    });
  }

  public getPlots(): Plot[] {
    let plots = this.dataServ.plots();
    if (this.session !== AnySession) {
      const sessionFilter = (item: Plot) => item.session === this.session.session;
      plots = plots.filter(sessionFilter);
    }
    if (this.selectedTags.length !== 0) {
      const tagsFilter = (item: Plot) => this.selectedTags.every((val) => item.tags.indexOf(val) !== -1);
      plots = plots.filter(tagsFilter);
    }
    // incremental words filter
    for (const word of this.split()) {
      plots = plots.filter(plot => plot.caption.toUpperCase().includes(word.toUpperCase())
        || plot.title.toUpperCase().includes(word.toUpperCase()));
    }
    return plots;
  }

  getSessions(): Session[] {
    const s = this.dataServ.sessions();
    if (!s.find(item => item === AnySession)) {
      s.unshift(AnySession);
    }
    return s;
  }

  public getTags(): string[] {
    let w: string[] = this.selectedTags.slice();
    this.getPlots().forEach(e => w = w.concat(...e.tags));
    return Array.from(new Set(w)).sort(this.dataServ.tagSorter());
  }

  isTagSelected(tag: string): boolean {
    return this.selectedTags.indexOf(tag) !== -1;
  }

  private removeTag(tag: string): void {
    if (this.isTagSelected(tag)) {
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    }
  }

  toggleTag(tag: string): void {
    if (this.isTagSelected(tag)) {
      this.removeTag(tag);
    }
    else {
      this.selectedTags.push(tag);
    }
  }

  tagColor(tag: string): string {
    return (this.isTagSelected(tag)) ? 'primary' : 'basic';
  }

  numberPlots(tag: string): number {
    return this.getPlots().filter(e => e.tags.indexOf(tag) !== -1).length;
  }

  split(): string[] {
    const tmp = this.filter.match(new RegExp(/(\w+|".*?")/, 'g'));
    if (!tmp) {
      return [];
    }
    const words = tmp.filter(e => e.length > 1).map(e => e.replace(new RegExp(/"/, 'g'), ''));
    return words;
  }

  setFilter(event: any): void {
    this.filter = event.target.value;
  }

  removeFromFilter(item: string): void {
    const tags = this.split();
    tags.splice(tags.indexOf(item), 1);
    console.log(tags);
    this.filter = tags.map(e => e.includes(' ') ? `"${e}"` : e).join(' ');
  }

  private reset(): void {
    this.selectedTags.length = 0;
    this.filter = '';
  }

  setSessionPlot(session: string): void {
    const sess = this.getSessions().find(item => item.session === session);
    if (sess) {
      this.session = sess;
      this.reset();
    }
  }

  sessionSelected(): boolean {
    return this.session !== AnySession;
  }

  private maxZoomLevel(): number {
    return Math.min(16, this.getPlots().length);
  }

  zoom(increment: number): void {
    this.currentScroll -= this.zoomLevel;
    if (increment !== 0) {
      if ((increment > 0 && this.zoomLevel < this.maxZoomLevel())
        || (increment < 0 && this.zoomLevel > 1)) {
        this.zoomLevel += increment;
      }
    }
    else {
      this.zoomLevel = 4;
    }
    if (this.zoomLevel > MINIFY_LIMIT) {
      this.minified = true;
    }
    // minus zooming
    if (this.zoomLevel < (MINIFY_LIMIT + 1) && increment <= 0) {
      this.minified = false;
    }
    this.currentScroll += this.zoomLevel;
    this.scrollListener();
  }

  zoomInDisabled(): boolean {
    return this.zoomLevel === 1;
  }

  zoomOutDisabled(): boolean {
    return this.zoomLevel === this.maxZoomLevel();
  }

  getZoomClass(): string {
    return englishNumbers[this.zoomLevel] + ' column grid';
  }

  getTerminalHelp(): void {
    const text: string[] = [];
    for (const plot of this.getPlots()) {
      const path = plot.png.split('/');
      path.splice(path.length - 1, 1);
      text.push('content/' + path.join('/') + '/metadata.yaml');
    }
    const blob = new Blob([text.join('\n')], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'plots_config_files.txt');
  }

  @HostListener('window:resize', ['$event'])
  @HostListener('window:scroll', ['$event'])
  scrollListener(): void {

    const scroll = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;

    const max = document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (scroll === max
      /* edge case: too less elements in row to scroll */
      || (scroll === 0 && max !== 0)
    ) {
      this.currentScroll += this.zoomLevel;
      const isNatural = (n: number) => n - Math.floor(n) === 0;
      const shift = isNatural(Math.floor(this.currentScroll / this.zoomLevel)) ? 0 : 1;
      this.currentScroll = (Math.floor(this.currentScroll / this.zoomLevel) + shift) * this.zoomLevel;
    }
  }

  // Imitate virtual scroll
  getPlotsScroll(): Plot[] {
    return this.getPlots().slice(0, this.currentScroll);
  }

  isLoaderShown(): boolean {
    return this.getPlots().length > this.currentScroll;
  }

  shareSearchObj(): any {
    const q: any = {};
    if (this.session !== AnySession) {
      q.session = encodeSessionURI(this.session.session);
    }
    if (this.filter.length !== 0) {
      q.filter = this.filter;
    }
    if (this.selectedTags.length !== 0) {
      q.tags = this.selectedTags;
    }
    return q;
  }

  private isAllExpanded(): boolean {
    return this.currentScroll === this.getPlots().length;
  }

  toggleAllClass(): string {
    if (this.isAllExpanded()) {
      return 'angle double up icon';
    } else {
      return 'angle double down icon';
    }
  }

  toggleAll(): void {
    if (this.isAllExpanded()) {
      // collapse
      this.currentScroll = this.zoomLevel;
      this.scrollListener();
    } else {
      // expand
      this.currentScroll = this.getPlots().length;
    }
  }

}
