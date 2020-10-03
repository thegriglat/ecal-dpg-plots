
import { EventEmitter } from '@angular/core';
import { Settings } from './../settings';
import { BehaviorSubject } from 'rxjs';


export const SectionEmitter = new EventEmitter<typeof Settings.sections[0]>();
export let currentSection: typeof Settings.sections[0];

SectionEmitter.subscribe((e: typeof Settings.sections[0]) => {
    currentSection = e;
})
