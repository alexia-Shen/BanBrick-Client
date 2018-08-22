
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { isNullOrUndefined, isArray } from 'util';

/*=========================linked list===========================*/
// fetch the whole list from root parent or end child
@Pipe({
    'name': 'orderBy',
    pure: false
  })
  export class OrderBy implements PipeTransform {
    symbols: string[] = ['-'];
    private isReverse(filter: any) {
      return typeof filter === 'string' && filter.length > 0 && filter.charAt(0) === '-';
    }
  
    private getValue(expression: string, obj: any) {
      for (let i = 0; i < this.symbols.length; i++) { // remove symbols
        if (expression.indexOf(this.symbols[i]) === 0) {
          expression = expression.substr(this.symbols[i].length);
        }
      }
      let keys = expression.split('.'), value = obj;
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (isNullOrUndefined(value) || (!value.hasOwnProperty(key) && !Object.getOwnPropertyDescriptor(Object.getPrototypeOf(value), key))) {
          return undefined; // not value
        }
        value = value[keys[i]];
      }
      return value;
    }
  
    private sortObjectFunction(valName: any, reverse: boolean) {
      return (obj1: any, obj2: any) => {
        let val1 = this.getValue(valName, obj1), val2 = this.getValue(valName, obj2);
        let r = reverse || this.isReverse(valName) ? -1 : 1;
        if (isNullOrUndefined(val1) || isNullOrUndefined(val2)) {
           return 0 + r;
        } else if (typeof val1 === 'string' && typeof val2 === 'string') {
          return val1.localeCompare(val2) * r;
        } else if (typeof val1 === 'number' && typeof  val2 === 'number') {
          return (val1 - val2) * r;
        } else if (typeof  val1.getTime === 'function' && typeof val2.getTime === 'function') {
          return (val1.getTime() - val2.getTime()) * r;
        }
        return 0;
      };
    };
  
    transform(items: any[], valName: any, reverse: boolean): any[] {
      if (isNullOrUndefined(valName) || !isArray(items)) {
        return items;
      }
      return items.sort(this.sortObjectFunction(valName, reverse));
    }
}
