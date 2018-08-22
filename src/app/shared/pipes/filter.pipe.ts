
import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { isNullOrUndefined, isArray } from 'util';

@Pipe({
    name: 'listFilter',
    pure: false
  })
  @Injectable()
  export class ListFilter implements PipeTransform {
    args: Object;
    readonly symbols: string[] = ['!'];
    readonly arithmetics: string[] = ['>', '<', '>=', '<='];

    private checkByString(filter: any, reverse: any) {
      return (val: any) => {
        return (val === filter) !== reverse;
      };
    }
    private checkByNumber(filter: any, arithmetic: any, reverse: any) {
      return (val: any) => {
        let e = eval;
        return isNullOrUndefined(arithmetic) ? (Number(val) === filter) !== reverse :
          e(val + arithmetic + filter);
      };
    }

    private checkByBoolean(filter: any, reverse: any) {
      return (value: any) => {
        return (Boolean(value) === filter) !== reverse;
      };
    }

    private checkByDate(filter: any, arithmetic: any, reverse: any) {
      const e = eval;
      return (value: any) => {
        if (isNaN(Date.parse(value)) || isNaN(Date.parse(filter))) { return false; }
        return isNullOrUndefined(arithmetic) ? (Date.parse(value) === Date.parse(filter)) !== reverse : 
          e(Date.parse(value) + arithmetic + Date.parse(filter));
      };
    }

    // check if value in that array
    private checkByArray(filter: any) {
      // something later
      return (value: any) => {
        for (let i = 0; i < filter.length; i++) {
          const filtr = typeof filter[i] === 'string' ? this.formatFilter(filter[i]) : filter[i], // obj value
          filtrType = typeof filtr;
          if ((filtrType === 'string' && isNaN(Date.parse(filtr)) && this.checkByString(filtr, false)(value))  ||
            (filtrType === 'string' && !isNaN(Date.parse(filtr)) && this.checkByDate(filtr, undefined, false)(value)) ||
            (filtrType === 'number' && this.checkByNumber(filtr, undefined, false)(value)) ||
            (filtrType === 'boolean' && this.checkByBoolean(filtr,false)(value)) ||
            (filtrType === 'object' && filtr.constructor === Array && this.checkByArray(filtr)(value)) ||
            (filtrType === 'object' && this.filterByObject(filtr)(value))) {
              return true;
          };
        }
        return false;
      };
    }

    private isReverse(filter: any) {
      return typeof filter === 'string' && filter.length > 0 && filter.charAt(0) === '!';
    }

    private checkArithmetic(filter: any) {
      for (let i = 0; i < this.arithmetics.length; i++) { // remove symbols
        if (filter.indexOf(this.arithmetics[i]) === 0) {
          return filter.substr(0, this.arithmetics[i].length);
        }
      }
      return null;
    }

    private getValue(expression: string, obj: Object) {
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
    private formatFilter(originText: string) {
      let value: string = originText;
      if (value.length <= 1) {
        return value;
      }
      for (let i = 0; i < this.symbols.length; i++) { // remove symbols
        if (originText.indexOf(this.symbols[i]) === 0) {
          value = originText.substr(this.symbols[i].length);
        }
      }
      if (!isNaN(parseInt(value, 10))) { // is number
        return Number(value);
      }

      if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') { // is boolean
        return Boolean(value);
      }

      // if (!isNaN(Date.parse(value))) { // isDate
      //   return Date.parse(value);
      // }
        return value;
    }

    private filterByObject(filter: any, miniMatch?: number) {
      return (value: any) => {
        let keys = Object.keys(filter);
        // looping through every filter item in object
        if (keys.length === 0) {
          return true;
        }

        let actualMatch = 0;
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];

          let val = this.getValue(key, value), reverse = this.isReverse(filter[key]),
            arithmetic = typeof filter[key] === 'string' ? this.checkArithmetic(filter[key]) : null,
            filtr = typeof filter[key] === 'string' ? this.formatFilter(filter[key]) : filter[key]; // obj value
          if (isNullOrUndefined(val) && !reverse) {
            return false;
          }

          if (key === '$or') {
            let orResult: any = this.filterByObject(filtr, 1)(val);
            return orResult;
          }
  
          let isMacthing = false;
          if (typeof filtr === 'string') {
            if (!isNaN(Date.parse(filtr))) { // is date
              isMacthing = this.checkByDate(filtr, arithmetic, reverse)(val);
            } else {
              isMacthing = this.checkByString(filtr, reverse)(val); // plain match
            }
          } else if (typeof filtr === 'number') {
            isMacthing = this.checkByNumber(filtr, arithmetic, reverse)(val);
          } else if (typeof filtr === 'boolean') {
            isMacthing = this.checkByBoolean(filtr, reverse)(val);
          } else if (typeof filtr === 'object') {
              if (filtr.constructor === Array) {
                isMacthing = this.checkByArray(filtr)(val);
              } else {
                isMacthing = this.filterByObject(filtr)(val);
              }
          } else if (typeof filtr === 'function') {
            isMacthing = filtr();
          }
          // if shouldMatch undefined than use AND operation
          if (isNaN(Number(miniMatch)) && isMacthing === false) {
            // once one field is not matching return false (AND)
            return false;
          } else {
            actualMatch += isMacthing === true ? 1 : 0;
          }
        }
        return Number(miniMatch) > 0 ? actualMatch >= miniMatch : actualMatch >= keys.length;
      };
    }
  
    transform(items: any[], args: any): any[] {
      /* take an object for filter
       - filter array by single value
       - filter array by array of value
       - filter objects by specific field(s) with single value ++
       - filter objects by specific fields{s) with multiple values (or operator)
       - filter by arithmetics [>, <, >=, <=] (number only)
       */
      const filterType = typeof args;
      if (isNullOrUndefined(args) || !isArray(items)) {
        return items;
      }
  
      let reverse = this.isReverse(args),
      arithmetic = typeof args === 'string' ? this.checkArithmetic(args) : null,
      filtr = typeof args === 'string' ? this.formatFilter(args) : args; // obj value
      switch (filterType) {
        case 'string':
          if (!isNaN(Date.parse(filtr))) {
            return items.filter(this.checkByDate(filtr, arithmetic, reverse));
          }
          return items.filter(this.checkByString(filtr, reverse));
        case 'number':
          return items.filter(this.checkByNumber(filtr, arithmetic, reverse));
        case 'boolean':
          return items.filter(this.checkByBoolean(filtr, reverse));
        case 'object':
          if (args.constructor === Array) {
            return items.filter(this.checkByArray(args));
          }
          return items.filter(this.filterByObject(args));
        case 'function':
          return items.filter(args); // callback(element, index, array)
        default:
          return items.filter(this.checkByString(args, reverse));
      }
    }
}
