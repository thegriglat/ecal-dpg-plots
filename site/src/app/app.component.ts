import { Component } from '@angular/core';

import { Plot, Session, AnySession } from './classes/types';

import * as data from './../data.json'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedTags: string[] = [];
  filter = "";
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
    })
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
}
