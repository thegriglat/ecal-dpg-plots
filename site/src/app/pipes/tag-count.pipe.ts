import { Pipe, PipeTransform } from '@angular/core';
import { Plot } from '../classes/types';

@Pipe({
  name: 'tagCount'
})
export class TagCountPipe implements PipeTransform {

  transform(plots: Plot[], tag: string): number {
    return plots.filter(e => e.tags.indexOf(tag) !== -1).length;
  }

}
