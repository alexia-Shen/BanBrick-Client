import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppRouteModule } from "./app.route";
import { AppComponent } from "./app.component";

// import components
import * as CommonComponents from './common';
import * as AppComponents from "./components";

@NgModule({
  declarations: [
    AppComponent
  ]
  .concat(esModuleToArray(CommonComponents))
  .concat(esModuleToArray(AppComponents)),
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRouteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

function esModuleToArray(esModule): any[] {
  const nameArray = [];
  for(const name in esModule){
    nameArray.push(name);
  }
  return nameArray.map(name => esModule[name])
}