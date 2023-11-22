import { Routes } from '@angular/router';
import { HomeComponent } from './components/nav/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate:[loginGuard]},
];
