import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Session, SessionQuery } from '../classes/types';
import { encodeSessionURI } from '../utils';

@Component({
  selector: 'app-session-list',
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {

  public sessions: Session[] = [];

  constructor(private dataServ: DataService) { }

  ngOnInit(): void {
    this.dataServ.download().subscribe(() => {
      this.sessions = this.dataServ.sessions();
    });
  }

  sessionObj(s: Session): SessionQuery {
    return {
      session: encodeSessionURI(s.session)
    };
  }
  formatDate(date: string): string {
    if (date === 'nodata') { return ''; }
    return date;
  }

}
