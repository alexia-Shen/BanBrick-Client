import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home';
import { NgModule } from '@angular/core';

const appRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'home/:id',      component: HomeComponent },
    { path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    //{ path: '**', component: PageNotFoundComponent }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } // <-- debugging purposes only
      )
      // other imports here
    ]
  })

  export class AppRouteModule { }