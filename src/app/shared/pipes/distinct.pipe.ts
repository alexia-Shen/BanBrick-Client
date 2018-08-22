
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { isNullOrUndefined, isArray } from 'util';

/*=========================linked list===========================*/
// fetch the whole list from root parent or end child
@Pipe({
    'name': 'distinct'
  })
  export class Distinct implements PipeTransform {
    private contain(items: any[], valName: any) {
      let keys = [], results = [];
      for (let i in items) {
        if (!isNullOrUndefined(items[i][valName]) && keys.indexOf(items[i][valName]) === -1) {
            results.push(items[i]);
            keys.push(items[i][valName]);
        }
      }
      return results;
    }
    transform(items: any[], valName: any): any[] {
      if (isNullOrUndefined(valName) || !isArray(items)) {
          return items;
      }
      return this.contain(items, valName);
    }
}
