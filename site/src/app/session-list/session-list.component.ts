import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Session, AnySession } from '../classes/types';
import { encodeSessionURI } from '../utils';
import { ActivatedRoute } from '@angular/router';
import { tap, map, flatMap } from 'rxjs/operators';
import { Settings, SectionType } from './../../settings';

function sessionSort(a: Session, b: Session): number {
  return a.session < b.session ? -1 : (a.session > b.session ? 1 : 0);
}

const TableSort = {
  asc: sessionSort,
  desc: (a: Session, b: Session) => -1 * sessionSort(a, b)
};

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  private allSessions: Session[] = [];
  public sessions: Session[] = [];
  private section!: SectionType;

  sortDirection: 'asc' | 'desc' | 'none' = 'none';

  filter = '';

  constructor(private activateRoute: ActivatedRoute, private dataServ: DataService) {

  }

  ngOnInit(): void {
    this.activateRoute.params.pipe(
      map(param => {
        const q = Settings.sections.find(e => e.url === param?.section) as SectionType;
        // TODO: catch bad section
        return q ? q : Settings.sections[0];
      }),
      tap(e => this.section = e),
      flatMap(section => this.dataServ.get(section))
    ).subscribe(() => {
      this.allSessions = this.dataServ.sessions().filter(e => e !== AnySession);
      this.sessions = this.allSessions.slice();
    });
  }

  sessionURL(s?: Session): string {
    if (!s) { return `/${this.section.url}/all`; }
    return `/${this.section.url}/${encodeSessionURI(s.session)}`;
  }

  formatDate(date: string): string {
    if (date === 'nodata') { return ''; }
    return date;
  }

  filterChange(evt: any): void {
    this.filter = evt.target.value;
    this.sessions = this.allSessions.filter(s => s.session.toLowerCase().includes(this.filter.toLowerCase()));
  }

  changeSortDirection(): void {
    if (this.sortDirection === 'none') {
      this.sortDirection = 'asc';
    }
    else if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    }
    else { this.sortDirection = 'asc'; }
    this.sessions = this.sessions.sort(TableSort[this.sortDirection]);
  }

}
