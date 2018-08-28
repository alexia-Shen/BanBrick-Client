import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AutoCompleteComponent, NavComponent } from '@app/common';

export interface SearchModel {

}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @Input() name;

  private _autoComplete: AutoCompleteComponent<SearchModel>;

  @ViewChild(AutoCompleteComponent)
  set addressAutoCompelete(autoComplete: AutoCompleteComponent<SearchModel>) {
    this._autoComplete = autoComplete;
    
    autoComplete.displayText = 'text display';
    autoComplete.onChange = (value) => { 
      return [{ display: 'abc', model: {} }, { display: 'bcd', model: {} }, { display: 'def', model: {} }] 
    };
  }

  @ViewChild(NavComponent)
  set navbar(header: NavComponent) {
    header.logoUrl = 'assets/logo.png';
  }

  private id;

  private onAutoCompleteInputChange(value) {
    console.log(value);
  }
  
  constructor(activatedRoute: ActivatedRoute) {
    const { id } = activatedRoute.snapshot.params;
    this.id = id;
  }
}
