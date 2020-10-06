import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Plot, Session, AnySession, SessionQuery } from './../classes/types';
import { Animations } from './../classes/animation';

import { encodeSessionURI, decodeSessionURI } from './../utils';

import { saveAs } from 'file-saver';

import { DataService } from '../services/data.service';
import { Settings } from 'settings';


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
// Allowed num symbols for filter
const MIN_FILTER_LEN = 1;

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
  zoomLevel = 4;
  nrows = 1;
  minified = false;
  session: Session = AnySession;
  allSessions: Session[] = [AnySession];

  public plots: Plot[] = [];

  currentSection = Settings.sections[0];

  ngOnInit(): void { }

  constructor(private activatedRoute: ActivatedRoute, private dataServ: DataService) {
    this.activatedRoute.params.subscribe(params => {
      // set section
      this.reset();
      const section = Settings.sections.find(e => e.url === params.section);
      const session: string = params.session ? decodeSessionURI(params.session) : '';
      this.currentSection = section ? section : Settings.sections[0];
      this.dataServ.get(this.currentSection).subscribe(data => {
        this.setSessions();
        // session provided
        const f = this.allSessions.find(item => item.session === session);
        if (f) {
          this.session = f;
        } else {
          this.session = AnySession;
        }
        const paramTags = this.activatedRoute.snapshot.queryParams?.tags;
        if (paramTags) {
          let tags: string[] = paramTags;
          if (typeof paramTags === 'string') {
            tags = [paramTags];
          }
          const allTags = this.dataServ.tags();
          for (const tag of tags) {
            if (allTags.includes(tag)) {
              this.toggleTag(tag);
            }
          }
        }
        const paramFilter = this.activatedRoute.snapshot.queryParams?.filter;
        if (paramFilter) {
          this.filter = paramFilter;
        }
        this.setPlots();
      });
    });
  }

  sessionURL(s: Session): string {
    // session url
    return `/${this.currentSection.url}/${encodeSessionURI(s.session)}`;
  }

  setPlots(): void {
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
    this.nrows = this.session === AnySession ? 2 : Math.round(plots.length / this.zoomLevel + 0.5);
    this.plots = plots;
  }

  setSessions(): void {
    const s = this.dataServ.sessions();
    if (!s.includes(AnySession)) {
      s.unshift(AnySession);
    }
    this.allSessions = s;
  }

  public getTags(): string[] {
    let w: string[] = this.selectedTags.slice();
    this.plots.forEach(e => w = w.concat(...e.tags));
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
    this.setPlots();
  }

  tagColor(tag: string): string {
    return (this.isTagSelected(tag)) ? 'primary' : 'basic';
  }

  split(): string[] {
    const tmp = this.filter.match(new RegExp(/(\w+|".*?")/, 'g'));
    if (!tmp) {
      return [];
    }
    const words = tmp.filter(e => e.length > MIN_FILTER_LEN).map(e => e.replace(new RegExp(/"/, 'g'), ''))
      // sort by length: first sort by the longest word
      .sort((a: string, b: string) => b.length - a.length);
    return words;
  }

  setFilter(event: any): void {
    this.filter = event.target.value;
    this.setPlots();
  }

  removeFromFilter(item: string): void {
    const tags = this.split();
    tags.splice(tags.indexOf(item), 1);
    this.filter = tags.map(e => {
      // restore quotes
      if (e.includes(' ') || e.replace(new RegExp(/"/, 'g'), '').length === MIN_FILTER_LEN) {
        return `"${e}"`;
      }
      return e;
    }).join(' ');
    this.setPlots();
  }

  private reset(): void {
    this.selectedTags.length = 0;
    this.filter = '';
    this.setPlots();
  }

  setSessionPlot(session: string): void {
    const sess = this.allSessions.find(item => item.session === session);
    if (sess) {
      this.session = sess;
      this.reset();
    }
  }

  sessionSelected(): boolean {
    return this.session !== AnySession;
  }

  private maxZoomLevel(): number {
    return Math.min(16, this.plots.length);
  }

  zoom(increment: number): void {
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
    for (const plot of this.plots) {
      const path = plot.files()[0].split('/');
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
      // preventive load a few rows (with ~ constant number of plots)
      this.nrows += Math.floor(16 / this.zoomLevel);
    }
  }

  isLoaderShown(): boolean {
    return this.plots.length / this.zoomLevel > this.nrows;
  }

  shareSearchObj(): SessionQuery {
    const q: SessionQuery = {};
    if (this.filter.length !== 0) {
      q.filter = this.filter;
    }
    if (this.selectedTags.length !== 0) {
      q.tags = this.selectedTags;
    }
    return q;
  }

  private isAllExpanded(): boolean {
    return this.nrows === Math.round(this.plots.length / this.zoomLevel + 0.5);
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
      this.nrows = 1;
      this.scrollListener();
    } else {
      // expand
      this.nrows = Math.round(this.plots.length / this.zoomLevel + 0.5);
    }
  }

  sectionTableURL(): string {
    return `/${this.currentSection.url}/list`;
  }

}
