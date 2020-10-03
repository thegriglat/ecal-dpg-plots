
import { EventEmitter } from '@angular/core';
import { Settings, SectionType } from './../settings';


export const SectionEmitter = new EventEmitter<SectionType>();
export let currentSection: SectionType;

SectionEmitter.subscribe((e: SectionType) => {
    currentSection = e;
})
