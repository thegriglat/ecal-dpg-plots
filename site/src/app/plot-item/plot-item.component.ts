import { Component, OnInit } from '@angular/core';
import { PlotCardComponent } from '../plot-card/plot-card.component';
import { SuiModalService } from '@richardlt/ng2-semantic-ui';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plot-item',
  templateUrl: './plot-item.component.html',
  styleUrls: ['./plot-item.component.css']
})
export class PlotItemComponent extends PlotCardComponent implements OnInit {

  constructor(modalService: SuiModalService, route: ActivatedRoute) {
    super(modalService, route);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
