import { Component } from '@angular/core';

import { Plot, Session, AnySession } from './classes/types';
import { saveAs } from 'file-saver';

import * as data from './../data.json'

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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedTags: string[] = [];
  filter = "";
  private zoomLevel = 4;
  minified = false;
  session: Session = AnySession;

  constructor() {

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

  addTag(tag: string) {
    if (this.selectedTags.indexOf(tag) == -1)
      this.selectedTags.push(tag);
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
    if (this.zoomLevel < (MINIFY_LIMIT + 1) && increment < 0) this.minified = false;
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
}
