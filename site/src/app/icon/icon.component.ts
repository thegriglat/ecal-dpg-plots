import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit {

  @Input() format = 'png';
  private allowedFormats = ['png', 'jpg', 'root', 'pdf'];
  constructor() { }

  ngOnInit(): void {
  }

  url(): string {
    if (!this.allowedFormats.includes(this.format)) {
      console.error(`Format '${this.format}' not allowed!`);
      this.format = 'png';
    }
    return `/assets/icons/${this.format}.svg`;
  }

}
