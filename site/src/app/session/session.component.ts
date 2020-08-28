import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Plot, Session, AnySession } from './../classes/types';
import { Animations } from './../classes/animation';

import { encodeSessionURI, decodeSessionURI } from './../utils';

import { saveAs } from 'file-saver';

import * as data from './../../data.json';

function sessionSplit(session: string): { year: number, n: number } {
  const q = session.split('/');
  const n = Number(q[1]);
  const q1 = q[0].split('-');
  const year = Number(q1[q1.length - 1]);
  return { year, n };
}

function PlotSort(a: Plot, b: Plot): number {
  const ases = a.session;
  const a0 = sessionSplit(ases);
  const bses = b.session;
  const b0 = sessionSplit(bses);
  if (a0.year < b0.year) {
    return 1;
  }
  else if (a0.year > b0.year) {
    return -1;
  }
  else {
    return b0.n - a0.n;
  }
}

function sessionSort(a: Session, b: Session): number {
  const nameA = a.session.toUpperCase();
  const nameB = b.session.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

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

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
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
    const tagsFilter = (item: Plot) => {
      if (this.selectedTags.length === 0) { return true; }
      return this.selectedTags.every((val) => item.tags.indexOf(val) !== -1);
    };
    const wordFilter = (item: Plot) => {
      const filtWords = this.split();
      if (filtWords.length === 0) { return true; }
      for (const word of filtWords) {
        if (!(item.caption.toUpperCase().includes(word.toUpperCase()) || item.title.toUpperCase().includes(word.toUpperCase()))) {
          return false;
        }
      }
      return true;
    };
    const sessionFilter = (item: Plot) => {
      if (this.session === AnySession) { return true; }
      return item.session === this.session.session;
    };
    return data.plots.filter(tagsFilter).filter(wordFilter).filter(sessionFilter).sort(PlotSort);
  }

  getSessions(): Session[] {
    const s = data.sessions.sort(sessionSort).reverse();
    if (!s.find(item => item === AnySession)) {
      s.unshift(AnySession);
    }
    return s;
  }

  public getTags(): string[] {
    let w: string[] = [];
    this.getPlots().forEach(e => w = w.concat(...e.tags));
    return Array.from(new Set(w)).sort();
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
    const words = tmp.filter(e => e.length !== 0).map(e => e.replace(new RegExp(/"/, 'g'), ''));
    return words;
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
