import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Plot } from '../classes/types';

import { saveAs } from 'file-saver';
import { Animations } from '../classes/animation';
import { SuiModalService } from '@richardlt/ng2-semantic-ui';
import { PlotModal } from '../plot-card-modal/plot-card-modal.component';
import { encodeSessionURI } from '../utils';
import { ActivatedRoute } from '@angular/router';
import { Settings } from 'src/settings';

@Component({
  selector: 'app-plot-card',
  templateUrl: './plot-card.component.html',
  styleUrls: ['./plot-card.component.css'],
  animations: [
    Animations.verticalSlideTop,
    Animations.verticalSlideDown
  ]
})
export class PlotCardComponent implements OnInit {

  @Input() plot!: Plot;
  @Input() minified = true;
  @Input() tags: string[] = [];
  @Input() collapsed = false;
  @Output() session = new EventEmitter<string>();
  @Output() tag = new EventEmitter<string>();

  isLoaded = false;

  constructor(private modalService: SuiModalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  url(format?: string): string[] {
    const fmt = (format) ? format : 'png';
    return this.plot.files(fmt).map(e => `assets/content/${e}`);
  }

  titleSet(): boolean {
    return this.plot.title !== null && this.plot.title !== 'notitle';
  }

  header(): string {
    return this.plot.title;
  }

  captions(): string[] {
    return this.plot.caption.split('\n');
  }

  date(): string {
    return this.plot.date;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
  }

  isCollapsed(): boolean {
    return this.collapsed;
  }

  save(url: string): void {
    const urlc = url.split('/');
    saveAs(`assets/content/${url}`, urlc[urlc.length - 1]);
  }

  getSession(): string {
    return this.plot.session;
  }

  sessionLink(): string {
    const section = this.route.snapshot.params.section;
    return `/${section}/${encodeSessionURI(this.plot.session)}`;
  }

  setTag(tag: string): void {
    this.tag.emit(tag);
  }

  getTagClass(tag: string): string {
    if (this.tags.indexOf(tag) !== -1) {
      return 'blue';
    }
    return 'gray';
  }

  isTagChecked(tag: string): boolean {
    return this.tags.indexOf(tag) !== -1;
  }

  getPermalink(): string {
    const session_uri = encodeSessionURI(this.plot.session);
    const section = this.route.snapshot.params.section;
    return `${section}/${session_uri}/${this.plot.name}`;
  }

  showModal(url: string): void {
    this.modalService.open(new PlotModal(url));
  }

  setLoad(isLoaded: boolean): void {
    this.isLoaded = true;
  }

  ext(filename: string): string {
    return filename.slice(filename.length - 3);
  }

  basename(path: string): string {
    const _l = path.split('/');
    const last = _l.pop();
    return last ? last : '';
  }

  editURL(): string {
    const _f = this.plot.files()[0];
    let path = _f.split('/');
    path = path.slice(1, path.length - 1);
    path.push('metadata.yaml');
    const section = this.route.snapshot.params.section;
    const _s = Settings.sections.find(e => e.url === section);
    const q = _s?.git.replace(/\.git/, '') + '/-/blob/master/content';
    path.unshift(q);
    return path.join('/');
  }
}
