import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slice'
})
export class SlicePipe<T> implements PipeTransform {

  transform(value: T[], end: number): T[] {
    return value.slice(0, end);
  }

}
