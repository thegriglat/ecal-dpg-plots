import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chunk'
})
export class ChunkPipe<T> implements PipeTransform {

  transform(list: T[], n: number): T[][] {
    const arrayChunks: T[][] = [];
    for (let i = 0; i < list.length; i += n) {
      const arrayChunk = list.slice(i, i + n);
      arrayChunks.push(arrayChunk);
    }
    return arrayChunks;
  }

}
