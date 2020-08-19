import { Component } from '@angular/core';

import { Plot } from './classes/types';

import * as data from './../data.json'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  selectedTags: string[] = [];

  constructor() {

  }

  public getPlots(): Plot[] {
    let q = data.plots as Plot[];
    q = q.filter(item => {
      if (this.selectedTags.length === 0) return true;
      return item.tags.some((val) => {
        return this.selectedTags.indexOf(val) >= 0;
      });
    })
    return q;
  }

  public getTags(): string[] {
    let w: string[] = [];
    data.plots.forEach(e => w = w.concat(...e.tags));
    let list = new Set(w);
    return Array.from(list);
  }

  private isTagSelected(tag: string): boolean {
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
}
