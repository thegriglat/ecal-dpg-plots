import { Pipe, PipeTransform } from '@angular/core';
import { Plot } from '../classes/types';

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  transform(value: any[], end: number): any[] {
    return value.slice(0, end);
  }

}
