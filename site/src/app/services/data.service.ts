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

function PlotSort(a: Plot, b: Plot): number {
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
