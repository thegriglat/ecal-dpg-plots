import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SuiModalService} from '@richardlt/ng2-semantic-ui';

@Component({
  selector: 'app-image-paginator',
  templateUrl: './image-paginator.component.html',
  styleUrls: ['./image-paginator.component.css']
})
export class ImagePaginatorComponent implements OnInit {
  pos = 0;
  constructor(private modalService: SuiModalService) {}

  @Input() urls: string[] = [];
  @Output() loadEvt = new EventEmitter();

  activeUrl = '';
  @Input() click: (s: string) => void = () => {};

  ngOnInit(): void {
    this.activeUrl = this.urls[0] || '';
  }

  updateLoad(): void {
    this.loadEvt.emit();
  }

  basename(str: string): string {
    const _q = str.split('/');
    return (_q.length > 0) ? _q.pop() as string : '';
  }
  next(): void {
    this.pos++;
    if (this.pos >= this.urls.length) {
      this.pos = 0;
    }
    this.activeUrl = this.urls[this.pos];
  }
  prev(): void {
    this.pos--;
    if (this.pos < 0) {
      this.pos = this.urls.length - 1;
    }
    this.activeUrl = this.urls[this.pos];
  }
}
