import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { RegisterComponent } from './components/register/register.component';
import { GameComponent } from './components/game/game.component';
import { GameDetailComponent } from './components/gameDetail/game-detail/game-detail.component';
import { NotFoundPageComponent } from './components/nav/not-found-page/not-found-page.component';
import { EditAccountComponent } from './components/user/edit-account/edit-account.component';
import { authGuard } from './guards/auth.guard';
import { EditDataComponent } from './components/user/edit-data/edit-data.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { DeleteAccountComponent } from './components/user/delete-account/delete-account.component';
import { ProfileComponent } from './components/user-profile/profile/profile.component';
import { UserGameListComponent } from './components/user-profile/user-game-list/user-game-list.component';
import { userGameListGuard } from './guards/user-game-list.guard';

export const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'home'},
  {path: 'home', component: HomePageComponent},
  {path: 'games', component: GameComponent},
  {path: 'games/:id', component: GameDetailComponent},
  {path: 'userProfile/:userId', component: ProfileComponent},
  {path: 'userGameList/:userId', component: UserGameListComponent, canActivate:[userGameListGuard]},
  {path: 'login', component: LoginComponent, canActivate:[loginGuard]},
  {path: 'register', component: RegisterComponent, canActivate:[loginGuard]},
  {path: 'editAccount', component: EditAccountComponent, canActivate:[authGuard]},
  {path: 'editUserData', component: EditDataComponent, canActivate:[authGuard]},
  {path: 'changePassword', component: ChangePasswordComponent, canActivate:[authGuard]},
  {path: 'deleteAccount', component: DeleteAccountComponent, canActivate:[authGuard]},
  {path: '**', component: NotFoundPageComponent}
];
