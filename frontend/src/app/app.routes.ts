import { Routes } from '@angular/router';
import { HomePageComponent } from './components/navigation/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { RegisterComponent } from './components/register/register/register.component';

export const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'home'},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginComponent, canActivate:[loginGuard]},
  {path: 'register', component: RegisterComponent, canActivate:[loginGuard]},
];
