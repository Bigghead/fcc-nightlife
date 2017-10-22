import { BarsComponent } from './bars/bars.component';
import { LandingComponent } from './landing/landing.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
//   { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: LandingComponent }, 
  { path: 'bars', component: BarsComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }