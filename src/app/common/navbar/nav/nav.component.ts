import { Component, Input } from '@angular/core';
import { NavItemComponent } from '@app/common';

@Component({
  selector: 'bb-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  @Input() logoUrl: string;
  @Input() navItem: NavItemComponent;

  constructor() {

  }
}