import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../../../models/user/userInfo';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { GenericUserGameListComponent } from '../generic-user-game-list/generic-user-game-list.component';

@Component({
  selector: 'app-user-favourite-game-list',
  standalone: true,
  imports: [GenericUserGameListComponent],
  templateUrl: './user-favourite-game-list.component.html',
  styleUrls: ['./user-favourite-game-list.component.css']
})
export class UserFavouriteGameListComponent implements OnInit{

  userId: number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isLoggedInUserList: boolean = false;
  loggedInUserId: number = 0;
  userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: []};
  router = inject(Router);

  constructor(private route: ActivatedRoute, private messageService : MessageService, private authService: AuthService, private userService: UserService){}

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
          this.isLoggedInUserList = true;
        }
      }
    })
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserById(this.userId).subscribe({
      next: (data: UserInfo) => {
        this.userInfo = data;
        this.userInfo.userBoardGames = this.userInfo.userBoardGames.filter(g => g.isFavourite === true)
      },
      error: (e) => {
        if (e instanceof ResourceNotFoundError){
          console.error("User not found");
        }
        if (e instanceof BadRequestError){
          this.router.navigate(['notfound'])
          console.error("User not found, bad request error");
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
      }
    })
  }

  toogleButton(userId: number): void{
    console.error(userId)
    this.router.navigate(['userGameList', userId]).then(() => {
      window.location.reload();
    });
  }

  onChangeGameEvent($event: boolean){
    if($event){
      this.ngOnInit();
    }
  }

}

