import { Pipe, PipeTransform } from '@angular/core';
import { Plot } from '../classes/types';

@Pipe({
  name: 'tagCount'
})
export class TagCountPipe implements PipeTransform {

  transform(plots: Plot[], tag: string): number {
    return plots.reduce(
      (accumulator: number, item: Plot) => accumulator + Number(item.tags.includes(tag))
      , 0);
  }

}
