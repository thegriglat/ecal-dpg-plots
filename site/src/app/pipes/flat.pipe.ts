import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flat'
})
export class FlatPipe<T> implements PipeTransform {

  transform(list: T[][]): T[] {
    return list.reduce((acc, item) => acc.concat(...item), []);
  }

}
