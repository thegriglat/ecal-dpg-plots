import { Pipe, PipeTransform } from '@angular/core';
import { Plot } from '../classes/types';

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  transform(value: Plot[], end: number): Plot[] {
    return value.slice(0, end);
  }

}
