import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { RegisterComponent } from './components/register/register.component';
import { GameComponent } from './components/game/game.component';
import { GameDetailComponent } from './components/gameDetail/game-detail/game-detail.component';

export const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'home'},
  {path: 'home', component: HomePageComponent},
  {path: 'games', component: GameComponent},
  {path: 'games/:id', component: GameDetailComponent},
  {path: 'login', component: LoginComponent, canActivate:[loginGuard]},
  {path: 'register', component: RegisterComponent, canActivate:[loginGuard]},
];
