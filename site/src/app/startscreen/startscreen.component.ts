import {Component, OnInit} from '@angular/core';
import {SectionType, Settings} from './../../settings';


@Component({
  selector: 'app-startscreen',
  templateUrl: './startscreen.component.html',
  styleUrls: ['./startscreen.component.css']
})
export class StartscreenComponent implements OnInit {
  constructor() {}
  get allSections(): SectionType[] {
    return Settings.sections;
  }
  ngOnInit(): void {}
}
