import { Component, OnInit, Input } from '@angular/core';
import { Animations } from './../../classes/animation';

@Component({
  selector: 'app-plot-permalink',
  templateUrl: './plot-permalink.component.html',
  styleUrls: ['./plot-permalink.component.css'],
  animations: [
    Animations.verticalSlideDown
  ]
})
export class PlotPermalinkComponent implements OnInit {

  @Input() url = '';
  visible = false;
  constructor() { }

  ngOnInit(): void {
  }

  public showCopiedMessage(): void {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, 3000);
  }

  fullurl(url: string): string {
    return `${window.location.href}/${url}`;
  }
}
