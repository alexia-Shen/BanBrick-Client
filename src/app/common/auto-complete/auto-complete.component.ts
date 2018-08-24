import { Component, Input } from '@angular/core';

@Component({
  selector: 'bb-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent<T> {
  @Input() onChange: (value: string) => { display: string, model: T }[];
  @Input() onSelect: (value: T[]) => void;
  @Input() displayText;

  private inputValue;

  constructor() {
  }

  private inputValueOnChange(event) {
    if(this.onChange) {
      this.onChange(this.inputValue);
    }
  }
}