import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  @Input() name;
  private id;

  constructor(activatedRoute : ActivatedRoute){
    const { id } = activatedRoute.snapshot.params;
    this.id = id;
  }


}
