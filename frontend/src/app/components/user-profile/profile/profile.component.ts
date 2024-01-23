import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserInfo } from '../../../models/user/userInfo';
import { MessageService } from 'primeng/api';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { UserBoardGame } from '../../../models/userGame/userBoardGame';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FavUser } from '../../../models/favUser/favUser';
import { FavUserService } from '../../../services/fav-user.service';
import { TooltipModule } from "primeng/tooltip"; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, TooltipModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userId: number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isLoggedInUserProfile: boolean = false;
  loggedInUserId: number = 0;
  userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: [], favouriteUsers: []};
  router = inject(Router);
  userGameListFirst5: UserBoardGame[] = [];
  userFavGameListFirst5: UserBoardGame[] = []
  userFavUsersFirst5: FavUser[] = [];
  totalFavGames: number = 0;
  isUserInFavList: boolean | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService, private authService: AuthService, private messageService : MessageService, private favUserService: FavUserService){}
  
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.userId = Number(param['userId'])
      }
    })
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if(this.isLoggedIn){
        this.loggedInUserId = Number(this.authService.getParsedToken().Id);
        if(this.loggedInUserId === this.userId){
          this.isLoggedInUserProfile = true;
        }
        else{
          this.favUserService.isUserInFavUserList(this.userId).subscribe({
            next: (data : boolean) => {
              this.isUserInFavList = data;
            },
            error: (e) => {
              if (e instanceof ResourceNotFoundError){
                console.error("User not found");
              }
              else if (e instanceof BadRequestError){
                this.router.navigate(['notfound'])
                console.error("User not found, bad request error");
              }
              else{
                this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
              }
            }
          })
        }
      }
    })
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserById(this.userId).subscribe({
      next: (data: UserInfo) => {
        this.userInfo = data;
        this.userGameListFirst5 = this.userInfo.userBoardGames.slice(0, 5);
        this.totalFavGames = this.userInfo.userBoardGames.filter(g => g.isFavourite === true).length
        this.userFavGameListFirst5 = this.userInfo.userBoardGames.filter(g => g.isFavourite === true).slice(0, 5);
        this.userFavUsersFirst5 = this.userInfo.favouriteUsers.slice(0, 5);
      },
      error: (e) => {
        if (e instanceof ResourceNotFoundError){
          console.error("User not found");
        }
        else if (e instanceof BadRequestError){
          this.router.navigate(['notfound'])
          console.error("User not found, bad request error");
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
      }
    })
  }

}
