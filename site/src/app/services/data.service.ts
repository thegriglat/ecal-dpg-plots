import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';
import { Plot, Session, Data } from '../classes/types';

// dummy data object. not visible under SUI loader
const dummyData: Data = {
  plots: [] as Plot[],
  sessions: [] as Session[],
  builddate: '',
  commit: ''
} as Data;

function sessionSplit(session: string): { year: number, n: number } {
  // cases:
  // CMS-TDR-015 => {15, 0}
  // CMS-DP-2020/021 => {2020, 21}
  const q = session.split('/');
  // q.length === 1 is TDR case
  const n = (q.length === 1) ? 0 : Number(q[1]);
  const q1 = q[0].split('-');
  const year = Number(q1[q1.length - 1]);
  return { year, n };
}

function azsort(a: string, b: string): number {
  const r = a.localeCompare(b, 'en', { ignorePunctuation: true });
  return ((r > 0) ? 1 : ((r < 0) ? -1 : 0));
}

function PlotSort(a: Plot, b: Plot): number {
  // sort plots:
  // 1. Session year
  // 2. Session number
  // 3. Alphabetically
  const ases = a.session;
  const a0 = sessionSplit(ases);
  const bses = b.session;
  const b0 = sessionSplit(bses);
  if (a0.year !== b0.year) {
    return b0.year - a0.year;
  }
  if (b0.n - a0.n !== 0) {
    return b0.n - a0.n;
  }
  return azsort(a.title.toUpperCase(), b.title.toUpperCase());
}

function sessionSort(a: Session, b: Session): number {
  const nameA = a.session.toUpperCase();
  const nameB = b.session.toUpperCase();
  return azsort(nameA, nameB);
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // download json data and set up inner caches
  // I used tap to set up caches independently observable
  // subscription time
  private downObs = this.http.get<Data>('/assets/data.json').pipe(
    tap(data => {
      this.data = data;
      this.sortedSessions = this.data.sessions.sort(sessionSort).reverse();
      this.sortedPlots = this.data.plots.sort(PlotSort);
      this.isDone = true;
    })
  );
  private data: Data = dummyData;
  private sortedSessions: Session[] = [];
  private sortedPlots: Plot[] = [];

  private isDone = false;

  constructor(private http: HttpClient) {
  }

  public download(): Observable<Data> {
    // returns data observable, download data if needed
    return this.isDone ? of(this.data) : this.downObs;
  }

  public get(): Data {
    // return data available else dummy object
    return this.data;
  }

  public done(): boolean {
    // return if data available
    return this.isDone;
  }

  public sessions(): Session[] {
    // return sessions if data is ready else []
    return this.sortedSessions;
  }

  public plots(): Plot[] {
    // return plots if data is ready else []
    return this.sortedPlots;
  }

  waitData<T>(obs: Observable<T>): Observable<T> {
    // wrapper for other observables to be sure that data is ready
    return this.isDone ? obs : this.downObs.pipe(
      flatMap(() => obs)
    );
  }
}
