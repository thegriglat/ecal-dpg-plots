import { Component, OnInit, Input } from '@angular/core';
import { IPopup } from '@richardlt/ng2-semantic-ui';

@Component({
  selector: 'app-plot-permalink',
  templateUrl: './plot-permalink.component.html',
  styleUrls: ['./plot-permalink.component.css']
})
export class PlotPermalinkComponent implements OnInit {

  @Input() url = '';
  constructor() { }

  ngOnInit(): void {
  }

  public showCopiedMessage(popup: IPopup): void {
    popup.open();
    setTimeout(() => popup.close(), 3000);
  }

  fullurl(url: string): string {
    return window.location.href + url;
  }
}
