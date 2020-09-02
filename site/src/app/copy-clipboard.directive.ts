import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({ selector: '[appCopyClipboard]' })
export class CopyClipboardDirective {

  @Input() appCopyClipboard = '';

  @Output() copied: EventEmitter<string> = new EventEmitter<string>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {

    event.preventDefault();
    if (!this.appCopyClipboard) {
      return;
    }

    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData;
      if (clipboard) {
        clipboard.setData('text', this.appCopyClipboard.toString());
        e.preventDefault();

        this.copied.emit(this.appCopyClipboard);
      } else {
        console.error('clipboardData is null');
      }
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
}
