
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { isNullOrUndefined, isArray } from 'util';

@Pipe({
    'name': 'limitTo',
    pure: false
  })
  export class LimitTo implements PipeTransform {
    transform(items: any, limit: any, startFrom?: any): any {
      if (isNullOrUndefined(items) || !(items.length > 0) || isNullOrUndefined(limit)) { return items; }
      let limi: number = parseInt(limit, 10) || items.length, start: number = startFrom ? parseInt(startFrom, 10) || 0 : 0;
      let results;
      if (isArray(items)) {
        results = [];
        items.forEach((x, index) => {
          if (index >= start && index < start + limi) {
            results.push(x);
          }
        });
      } else if (typeof items === 'string') {
        results = (start === 0 ? '' : '...') + items.substr(start, limi) + (items.length > limi ? '...' : '');
      }
      return results;
    }
}  