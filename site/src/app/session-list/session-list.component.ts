import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Session, AnySession } from '../classes/types';
import { encodeSessionURI } from '../utils';
import { ActivatedRoute } from '@angular/router';
import { tap, map, flatMap } from 'rxjs/operators';
import { Settings, SectionType } from 'settings';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  public sessions: Session[] = [];
  private section!: SectionType;

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
      this.sessions = this.dataServ.sessions().filter(e => e !== AnySession);
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

}
