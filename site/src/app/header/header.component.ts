import {Component, OnInit} from '@angular/core';
import {ActivationStart, Router} from '@angular/router';

import {SectionType, Settings} from './../../settings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isOpen = false;
  currentSection: SectionType|null = null;
  currentRoute: string[] = [];
  get allSections(): SectionType[] {
    return Settings.sections.filter(e => e !== this.currentSection);
  }

  constructor(private route: Router) {
    this.route.events.subscribe(evt => {
      if (evt instanceof ActivationStart) {
        const section = evt.snapshot.params?.section;
        if (section !== undefined) {
          const sec = Settings.sections.find(e => e.url === section);
          this.currentSection = (sec) ? sec : Settings.sections[0];
          this.currentRoute = evt.snapshot.url.map(e => e.path);
          if (this.currentRoute.length > 1 && this.currentRoute[1] !== 'list') {
            this.currentRoute = this.currentRoute.slice(0, 1);
          }
        }
      }
      this.isOpen = false;
    });
  }

  ngOnInit(): void {}

  getURL(s: SectionType): string {
    const q = this.currentRoute.slice();
    q[0] = s.url;
    return `/${q.join('/')}`;
  }

  get next(): SectionType {
    const _l = Settings.sections.length;
    const _idx = this.currentSection ?
        Settings.sections.indexOf(this.currentSection) :
        0;
    let pos = _idx + 1;
    if (pos > _l - 1) {
      pos = 0;
    }
    return Settings.sections[pos];
  }

  get prev(): SectionType {
    const _l = Settings.sections.length;
    const _idx = this.currentSection ?
        Settings.sections.indexOf(this.currentSection) :
        _l - 1;
    let pos = _idx - 1;
    if (pos < 0) {
      pos = _l - 1;
    }
    return Settings.sections[pos];
  }

  multipleSections(): boolean {
    return Settings.sections.length > 1;
  }
}
