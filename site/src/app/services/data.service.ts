import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plot, Session, Data } from '../classes/types';

const dummyData: Data = {
  plots: [] as Plot[],
  sessions: [] as Session[],
  builddate: '',
  commit: ''
} as Data;

function sessionSplit(session: string): { year: number, n: number } {
  const q = session.split('/');
  const n = Number(q[1]);
  const q1 = q[0].split('-');
  const year = Number(q1[q1.length - 1]);
  return { year, n };
}

function PlotSort(a: Plot, b: Plot): number {
  const ases = a.session;
  const a0 = sessionSplit(ases);
  const bses = b.session;
  const b0 = sessionSplit(bses);
  if (a0.year < b0.year) {
    return 1;
  }
  else if (a0.year > b0.year) {
    return -1;
  }
  else {
    return b0.n - a0.n;
  }
}

function sessionSort(a: Session, b: Session): number {
  const nameA = a.session.toUpperCase();
  const nameB = b.session.toUpperCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: Data = dummyData;
  private isDone = false;

  private sortedSessions: Session[] = [];
  private sortedPlots: Plot[] = [];


  constructor(private http: HttpClient) {
    this.download().subscribe((e: Data) => {
      this.data = e;
      this.isDone = true;
      this.sortedSessions = this.data.sessions.sort(sessionSort).reverse();
      this.sortedPlots = this.data.plots.sort(PlotSort);
    });
  }

  public download(): Observable<Data> {
    return this.http.get<Data>('/assets/data.json');
  }

  public done(): boolean {
    return this.isDone;
  }

  public get(): Data {
    return this.data;
  }

  public sessions(): Session[] {
    return this.sortedSessions;
  }

  public plots(): Plot[] {
    return this.sortedPlots;
  }
}
