import { Routes } from '@angular/router';
import { HomePageComponent } from './components/home/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { loginGuard } from './guards/login.guard';
import { RegisterComponent } from './components/register/register.component';
import { GameComponent } from './components/boardGame/game/game.component';
import { GameDetailComponent } from './components/boardGame/game-detail/game-detail.component';
import { NotFoundPageComponent } from './components/nav/not-found-page/not-found-page.component';
import { EditAccountComponent } from './components/user/edit-account/edit-account.component';
import { authGuard } from './guards/auth.guard';
import { EditDataComponent } from './components/user/edit-data/edit-data.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { ProfileComponent } from './components/user-profile/profile/profile.component';
import { UserGameListComponent } from './components/user-profile/user-game-list/user-game-list.component';
import { ForbiddenPageComponent } from './components/nav/forbidden-page/forbidden-page.component';
import { UserFavouriteGameListComponent } from './components/user-profile/user-favourite-game-list/user-favourite-game-list.component';
import { FavUserListComponent } from './components/user-profile/fav-user-list/fav-user-list.component';
import { TopGamesComponent } from './components/boardGame/top-games/top-games.component';
import { BoardGameSettingsComponent } from './components/admin/board-game-settings/board-game-settings.component';
import { DeleteAccountComponent } from './components/user/delete-account/delete-account.component';
import { adminGuard } from './guards/admin.guard';
import { UserRequestComponent } from './components/admin/user-request/user-request.component';
import { UserOnOtherProfilesComponent } from './components/user-profile/user-on-other-profiles/user-on-other-profiles.component';

export const routes: Routes = [
  {path: '', pathMatch:'full', redirectTo: 'home'},
  {path: 'home', component: HomePageComponent},
  {path: 'games', component: GameComponent},
  {path: 'topGames', component: TopGamesComponent},
  {path: 'games/:id', component: GameDetailComponent},
  {path: 'userProfile/:userId', component: ProfileComponent},
  {path: 'forbidden', component: ForbiddenPageComponent},
  {path: 'userGameList/:userId', component: UserGameListComponent},
  {path: 'userFavouriteGameList/:userId', component: UserFavouriteGameListComponent},
  {path: 'userFavouriteUserList/:userId', component: FavUserListComponent},
  {path: 'meOnOtherProfiles', component: UserOnOtherProfilesComponent},
  {path: 'login', component: LoginComponent, canActivate:[loginGuard]},
  {path: 'register', component: RegisterComponent, canActivate:[loginGuard]},
  {path: 'editAccount', component: EditAccountComponent, canActivate:[authGuard]},
  {path: 'editUserData', component: EditDataComponent, canActivate:[authGuard]},
  {path: 'changePassword', component: ChangePasswordComponent, canActivate:[authGuard]},
  {path: 'deleteAccount', component: DeleteAccountComponent, canActivate:[authGuard]},
  {path: 'boardGameSettings', component: BoardGameSettingsComponent, canActivate:[adminGuard]},
  {path: 'userRequests', component: UserRequestComponent, canActivate:[adminGuard]},
  {path: '**', component: NotFoundPageComponent}
];
