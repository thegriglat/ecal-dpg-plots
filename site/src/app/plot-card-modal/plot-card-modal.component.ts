import { Component, OnInit } from '@angular/core';
import { ComponentModalConfig, ModalSize } from '@richardlt/ng2-semantic-ui';
import { SuiModal } from '@richardlt/ng2-semantic-ui';
import { Plot } from './../classes/types';

interface IConfirmModalContext {
  plot: Plot;
}

export class PlotModal extends ComponentModalConfig<IConfirmModalContext, void> {
  constructor(plot: Plot, size = ModalSize.Normal) {
    super(PlotCardModalComponent, { plot });
    this.isFullScreen = false;
    this.isCentered = true;
    this.isClosable = true;
    this.transitionDuration = 200;
    this.size = size;
    this.isInverted = true;
    this.isBasic = false;
  }
}

@Component({
  selector: 'app-plot-card-modal',
  templateUrl: './plot-card-modal.component.html',
  styleUrls: ['./plot-card-modal.component.css']
})
export class PlotCardModalComponent implements OnInit {

  plot: Plot;

  constructor(public modal: SuiModal<IConfirmModalContext, void>) {
    this.plot = Object.assign({}, modal.context.plot);
  }

  ngOnInit(): void {
  }

  url(): string {
    return 'assets/content/' + this.plot.png;
  }

}
