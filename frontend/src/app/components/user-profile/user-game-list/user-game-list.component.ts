import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserBoardGame } from '../../../models/userGame/userBoardGame';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { CommonModule } from '@angular/common';
import { DataViewModule} from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { UserInfo } from '../../../models/user/userInfo';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-game-list',
  standalone: true,
  imports: [CommonModule, DataViewModule, RouterModule, InputTextModule, ButtonModule],
  templateUrl: './user-game-list.component.html',
  styleUrls: ['./user-game-list.component.css']
})
export class UserGameListComponent implements OnInit{

  userId : number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isCurrentUserList: boolean = false;
  currentUserId: number = 0;
  userBoardGameList: UserBoardGame[] = [];
  userInfo: UserInfo = { id: 0, nickName: '', email: ''};


  constructor(private route: ActivatedRoute, private messageService : MessageService, private userBoardGameService: UserBoardGameService, private authService: AuthService, private userService: UserService){}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (param) => {
        this.userId = param['userId']
      }
    })

    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if(this.isLoggedIn){
        this.currentUserId = this.authService.getParsedToken().Id;
        if(this.currentUserId === this.userId){
          this.isCurrentUserList = true;
        }
      }
    })
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserById(this.userId).subscribe({
      next: (data: UserInfo) => {
        this.userInfo = data;
        this.getUserBoardGames();
      },
      error: (e) => {
        if (e instanceof ResourceNotFoundError){
          console.error("User not found");
        }
        if (e instanceof BadRequestError){
          console.error("User not found, bad request error");
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
      }
    })
  }

  getUserBoardGames(){
    this.userBoardGameService.getUserBoardGames(this.userId).subscribe({
      next: (data: UserBoardGame[]) => {
        this.userBoardGameList = data;
      },
      error: (e) => {
        if (e instanceof ResourceNotFoundError){
          console.error("User not found");
        }
        if (e instanceof BadRequestError){
          console.error("User not found, bad request error");
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
      }
    })

  }

}
