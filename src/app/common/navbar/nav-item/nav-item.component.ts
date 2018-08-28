import { Component, Input } from '@angular/core';

@Component({
  selector: 'bb-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
  @Input() href: string;
  @Input() subItems: NavItemComponent[];
  
  constructor() {

  }
}