import { Component, Input } from '@angular/core';

@Component({
  selector: 'bb-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent<T> {
  @Input() onClick: (event: Event) => void;
  @Input() text;
  @Input() size;

  constructor() {

  }
}