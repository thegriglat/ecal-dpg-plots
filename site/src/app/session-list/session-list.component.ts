import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Session, SessionQuery, AnySession } from '../classes/types';
import { encodeSessionURI } from '../utils';
import { ActivatedRoute } from '@angular/router';
import { tap, map, flatMap } from 'rxjs/operators';
import { Settings } from 'settings';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  public sessions: Session[] = [];
  private section = '';

  constructor(private activateRoute: ActivatedRoute, private dataServ: DataService) {

  }

  ngOnInit(): void {
    this.activateRoute.params.pipe(
      map(param => {
        const q = Settings.sections.find(e => e.url === param?.section);
        return q ? q : Settings.sections[0];
      }),
      tap(e => this.section = e.url),
      flatMap(section => this.dataServ.get(section))
    ).subscribe(() => {
      console.log(this.dataServ.data);
      this.sessions = this.dataServ.sessions().filter(e => e !== AnySession);
    });
  }

  sessionObj(s: Session): SessionQuery {
    return {
      section: this.section,
      session: encodeSessionURI(s.session)
    };
  }
  formatDate(date: string): string {
    if (date === 'nodata') { return ''; }
    return date;
  }

}
