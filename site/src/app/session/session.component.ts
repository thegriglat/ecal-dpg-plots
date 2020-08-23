import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { Plot, Session, AnySession } from './../classes/types';
import { saveAs } from 'file-saver';

import * as data from './../../data.json'
import { trigger, transition, style, animate, state } from '@angular/animations';

function PlotSort(a: Plot, b: Plot) {
  const nameA = a.title.toUpperCase();
  const nameB = b.title.toUpperCase();
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
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen"
];

// zoom level to auto enable minify
const MINIFY_LIMIT = 6;

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.css'],
  animations: [
    trigger('fadeAnimation', [
      // https://www.kdechant.com/blog/angular-animations-fade-in-and-fade-out
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(250)
      ]),
      transition(':leave',
        animate(250, style({ opacity: 0 })))
    ])
  ]
})
export class SessionComponent implements OnInit {


  selectedTags: string[] = [];
  filter = "";
  private zoomLevel = 4;
  private currentScroll = this.zoomLevel;
  minified = false;
  session: Session = AnySession;

  ngOnInit(): void { }

  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      const session: string = params['session'];
      if (session) {
        // session provided
        const f = this.getSessions().find(item => item.session === session);
        if (f) {
          // session found
          this.session = f;
        }
      }
    });
  }

  public getPlots(): Plot[] {
    let q = data.plots as Plot[];
    return q.filter(item => {
      if (this.selectedTags.length === 0) return true;
      return this.selectedTags.every((val) => {
        return item.tags.indexOf(val) !== -1;
      });
    }).filter(item => {
      const filtWords = this.split();
      if (filtWords.length === 0) return true;
      for (const word of filtWords)
        if (!item.caption.toUpperCase().includes(word.toUpperCase()))
          return false;
      return true;
    }).filter(item => {
      if (this.session === AnySession) return true;
      return item.session === this.session.session;
    }).sort(PlotSort);
  }

  getSessions(): Session[] {
    const s = data.sessions;
    if (!s.find(item => item === AnySession))
      s.unshift(AnySession);
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

  private removeTag(tag: string) {
    if (this.isTagSelected(tag))
      this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
  }

  toggleTag(tag: string): void {
    if (this.isTagSelected(tag)) this.removeTag(tag);
    else this.selectedTags.push(tag);
  }

  tagColor(tag: string): string {
    return (this.isTagSelected(tag)) ? "primary" : "basic";
  }

  numberPlots(tag: string): number {
    return this.getPlots().filter(e => e.tags.indexOf(tag) !== -1).length;
  }

  split(): string[] {
    return this.filter.split(" ").filter(e => e.length !== 0);
  }

  removeFromFilter(item: string) {
    this.filter = this.filter.replace(item, "").trim();
  }

  private reset() {
    this.selectedTags.length = 0;
    this.filter = "";
  }

  setSessionPlot(session: string) {
    const sess = this.getSessions().find(item => item.session === session);
    if (sess) {
      this.session = sess;
      this.reset();
    }
  }

  sessionSelected(): boolean {
    return this.session !== AnySession;
  }

  zoom(increment: number) {

    if (increment != 0) {
      if ((increment > 0 && this.zoomLevel < 16)
        || (increment < 0 && this.zoomLevel > 1))
        this.zoomLevel += increment;
    }
    else
      this.zoomLevel = 4;
    if (this.zoomLevel > MINIFY_LIMIT) this.minified = true;
    // minus zooming
    if (this.zoomLevel < (MINIFY_LIMIT + 1) && increment <= 0) this.minified = false;
    this.currentScroll = this.zoomLevel;
  }

  getZoomClass(): string {
    return englishNumbers[this.zoomLevel] + " column grid";
  }

  getTerminalHelp() {
    let text: string[] = [];
    for (let plot of this.getPlots()) {
      let path = plot.png.split("/");
      path.splice(path.length - 1, 1);
      text.push("content/" + path.join("/") + "/metadata.yaml");
    }
    const blob = new Blob([text.join("\n")], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "plots_config_files.txt");
  }

  @HostListener('window:scroll', ['$event'])
  scrollListener() {

    const scroll = window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop || 0;

    const max = document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (scroll === max) {
      this.currentScroll += this.zoomLevel;
    }
  }

  // Imitate virtual scroll
  getPlotsScroll(): Plot[] {
    return this.getPlots().slice(0, this.currentScroll);
  }

}
