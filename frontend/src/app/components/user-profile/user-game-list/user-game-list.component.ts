import { Component, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { CommonModule } from '@angular/common';
import { DataViewModule} from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { UserInfo } from '../../../models/user/userInfo';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericUserGameListComponent } from '../generic-user-game-list/generic-user-game-list.component';

@Component({
  selector: 'app-user-game-list',
  standalone: true,
  imports: [CommonModule, DataViewModule, RouterModule, InputTextModule, ButtonModule, ReactiveFormsModule, RatingModule, FormsModule, GenericUserGameListComponent],
  templateUrl: './user-game-list.component.html',
  styleUrls: ['./user-game-list.component.css']
})
export class UserGameListComponent implements OnInit{

  userId : number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isLoggedInUserList: boolean = false;
  loggedInUserId: number = 0;
  userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: []};
  router = inject(Router);

  gameEditForm = this.formBuilder.group({
    rating: [0],
    addToFavourites: [false]
  })

  constructor(private route: ActivatedRoute, private messageService : MessageService,private formBuilder: FormBuilder, private authService: AuthService, private userService: UserService){}

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
        this.loggedInUserId = this.authService.getParsedToken().Id;
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
        if (e instanceof BadRequestError){
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
    this.router.navigate(['userFavouriteGameList', userId]);
  }

}
