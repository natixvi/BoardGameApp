import { Component, OnInit, inject} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { UserInfo } from '../../../models/user/userInfo';
import { UserService } from '../../../services/user.service';
import { GenericUserGameListComponent } from '../generic-user-game-list/generic-user-game-list.component';

@Component({
  selector: 'app-user-game-list',
  standalone: true,
  imports: [GenericUserGameListComponent],
  templateUrl: './user-game-list.component.html',
  styleUrls: ['./user-game-list.component.css']
})
export class UserGameListComponent implements OnInit{

  userId: number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isLoggedInUserList: boolean = false;
  loggedInUserId: number = 0;
  userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: [], favouriteUsers: []};
  router = inject(Router);

  constructor(private route: ActivatedRoute, private messageService : MessageService, private authService: AuthService, private userService: UserService){
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.userId = Number(params.get('userId'))
      this.initialData()
    })
  }

  initialData(){
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

  toogleButton(userId: number): void{
    this.router.navigate(['userFavouriteGameList', userId]);
  }

  onChangeGameEvent($event: boolean){
    if($event){
      this.ngOnInit();
    }
  }
}
