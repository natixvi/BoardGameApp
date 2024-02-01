import { Component, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router, RouterModule } from '@angular/router';
import { Observable, Subscription, map, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { UserInfo } from '../../../models/user/userInfo';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { UserBoardGame } from '../../../models/userGame/userBoardGame';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FavUser } from '../../../models/favUser/favUser';
import { FavUserService } from '../../../services/fav-user.service';
import { TooltipModule } from "primeng/tooltip"; 
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { UserOnOtherProfile } from '../../../models/favUser/userOnOtherProfile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule, TooltipModule, TableModule, AvatarModule, AvatarGroupModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: []
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
  usersWhoAddedUserToFriends: UserOnOtherProfile[] = [];
  totalFavGames: number = 0;
  isUserInFavList: boolean | undefined;
  userSub: Subscription | undefined;

  constructor(private route: ActivatedRoute, private userService: UserService, private confirmationService: ConfirmationService, private authService: AuthService, private messageService : MessageService, private favUserService: FavUserService){}
  
  ngOnInit(): void {  
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'))
      this.initalData()
    })
  }

  initalData(){
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if(this.isLoggedIn){
        this.loggedInUserId = Number(this.authService.getParsedToken().Id);
        if(this.loggedInUserId === this.userId){
          this.isLoggedInUserProfile = true;  
        } 
        else{
          this.isLoggedInUserProfile = false;
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
    this.getUsersWhoAddedSelectUserToFriends(this.userId);
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

  getUsersWhoAddedSelectUserToFriends(userId: number){
    this.favUserService.getUsersWhoAddedSelectUserToFriends(userId).subscribe({
      next: (data: UserOnOtherProfile[]) => {
        this.usersWhoAddedUserToFriends = data.slice(0, 5);
      },
      error: (e) =>{
        if (e instanceof BadRequestError){
          this.router.navigate(['notfound']);
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof ResourceNotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
    })
  }

  addUserToFavList(){
    this.favUserService.addUserToFavUserList(this.userId).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'User added to favourite list.'})
        this.ngOnInit();
      },
      error: (e) =>{
        if (e instanceof BadRequestError){
          this.router.navigate(['notfound']);
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof DuplicatedDataError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof ResourceNotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
    })
  }

  removeUserFromFavList(userId: number){
    this.confirmationService.confirm({
      message: "Are you sure you want to remove user from your favorite list?",
      header: "Confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        this.favUserService.deleteUserFromFavUserList(userId).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'User deleted from favourite list.'})
            this.ngOnInit();
          },
          error: (e) =>{
            if (e instanceof BadRequestError){
              this.router.navigate(['notfound']);
              this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
            }
            else if(e instanceof DuplicatedDataError){
              this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
            }
            else if(e instanceof ResourceNotFoundError){
              this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
            }
            else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
          }
        })
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Remove user from favourite list canceled.' });
        this.confirmationService.close();
      }
    })
    
  }

}
