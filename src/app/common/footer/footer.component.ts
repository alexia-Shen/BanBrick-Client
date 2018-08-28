import { Component, Input } from '@angular/core';

@Component({
  selector: 'bb-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent<T> {
  @Input() onClick: (event: Event) => void;
  @Input() text;
  @Input() size;

  constructor() {

  }
}