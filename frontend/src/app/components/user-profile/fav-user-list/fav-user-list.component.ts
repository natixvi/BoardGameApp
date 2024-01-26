import { Component, inject } from '@angular/core';
import { UserInfo } from '../../../models/user/userInfo';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { FavUserService } from '../../../services/fav-user.service';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from "primeng/tooltip"; 
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  selector: 'app-fav-user-list',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule, ButtonModule, TooltipModule, ToolbarModule],
  templateUrl: './fav-user-list.component.html',
  styleUrls: ['./fav-user-list.component.css']
})
export class FavUserListComponent {
  userId: number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isLoggedInUserProfile: boolean = false;
  loggedInUserId: number = 0;
  userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: [], favouriteUsers: []};
  router = inject(Router);

  constructor(private route: ActivatedRoute, private userService: UserService, private confirmationService: ConfirmationService, private authService: AuthService, private messageService : MessageService, private favUserService: FavUserService){}

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
      }
    })
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserById(this.userId).subscribe({
      next: (data: UserInfo) => {
        this.userInfo = data;
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
