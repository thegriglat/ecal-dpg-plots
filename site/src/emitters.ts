
import { EventEmitter } from '@angular/core';
import { Settings } from './../settings';
import { BehaviorSubject } from 'rxjs';


export const SectionEmitter = new BehaviorSubject<typeof Settings.sections[0]>(Settings.sections[0]);
