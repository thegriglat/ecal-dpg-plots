import { Component, OnInit } from '@angular/core';
import { ComponentModalConfig, ModalSize } from '@richardlt/ng2-semantic-ui';
import { SuiModal } from '@richardlt/ng2-semantic-ui';
import { Plot } from './../classes/types';

interface IConfirmModalContext {
  url: string;
}

export class PlotModal extends ComponentModalConfig<IConfirmModalContext, void> {
  constructor(url: string, size = ModalSize.Normal) {
    super(PlotCardModalComponent, { url });
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

  url: string;

  constructor(public modal: SuiModal<IConfirmModalContext, void>) {
    this.url = modal.context.url;
  }

  ngOnInit(): void {
  }

}
