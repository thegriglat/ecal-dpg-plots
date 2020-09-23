import { Component, OnInit } from '@angular/core';
import { Settings } from './../../../settings';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  title = Settings.title;
  constructor() { }

  ngOnInit(): void {
  }

}
