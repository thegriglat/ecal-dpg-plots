import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SuiModalService } from '@richardlt/ng2-semantic-ui';

@Component({
  selector: 'app-image-paginator',
  templateUrl: './image-paginator.component.html',
  styleUrls: ['./image-paginator.component.css']
})
export class ImagePaginatorComponent implements OnInit {

  constructor(private modalService: SuiModalService) { }

  @Input() urls: string[] = [];
  @Output() loadEvt = new EventEmitter();

  activeUrl = '';
  @Input() click: (s: string) => void = () => { };

  ngOnInit(): void {
    this.activeUrl = this.urls[0] || '';
  }

  updateLoad(): void {
    this.loadEvt.emit();
  }

}
