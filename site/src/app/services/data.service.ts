import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Plot, Session, Data } from '../classes/types';

const dummyData: Data = {
  plots: [] as Plot[],
  sessions: [] as Session[],
  builddate: '',
  commit: ''
};

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = dummyData;
  private isDone = false;

  constructor(private http: HttpClient) {
    this.download().subscribe((e: Data) => {
      this.data = e;
      this.isDone = true;
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
}
