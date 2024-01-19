import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { CommonModule } from '@angular/common';
import { DataViewModule} from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { UserInfo } from '../../../models/user/userInfo';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditUserGameDetails } from '../../../models/userGame/editUserGameDetails';

@Component({
  selector: 'app-user-game-list',
  standalone: true,
  imports: [CommonModule, DataViewModule, RouterModule, InputTextModule, ButtonModule, ReactiveFormsModule, RatingModule, FormsModule],
  templateUrl: './user-game-list.component.html',
  styleUrls: ['./user-game-list.component.css']
})
export class UserGameListComponent implements OnInit{

  userId : number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isCurrentUserList: boolean = false;
  currentUserId: number = 0;
  rateValue: number = 0;
  userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: []};
  router = inject(Router);
  isFavourite: boolean | undefined;
  openUserGameForm: boolean = false;
  isFavActive: boolean = false;
  selectedGameId: number | null = null;

  gameEditForm = this.formBuilder.group({
    rating: [0],
    addToFavourites: [false]
  })

  constructor(private route: ActivatedRoute, private messageService : MessageService,private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private userBoardGameService: UserBoardGameService, private authService: AuthService, private userService: UserService){}

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

  closeEditForm(){
    this.selectedGameId = null;
    this.openUserGameForm = false;
  }

  showEditUserGameForm(gameId: number){
    this.selectedGameId = gameId;
    this.openUserGameForm = true;
  }

  onFavClick(){
    this.isFavActive = !this.isFavActive;
    this.gameEditForm.get('addToFavourites')?.setValue(this.isFavActive)
  }
  
  editUserGameDetails(gameId: number){
    console.error(this.gameEditForm.get('rating')?.value)
    this.confirmationService.confirm({
      message: "Are you sure you want to edit game on your list?",
      header: "Confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {

        const editUserGameData = {
          rating: this.gameEditForm.get('rating')?.value, 
          isFavourite: this.gameEditForm.get('addToFavourites')?.value
        } as EditUserGameDetails;

        this.userBoardGameService.editUserGameDetails(gameId, editUserGameData).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Game edited.'})
            this.openUserGameForm = false;
            this.ngOnInit();
          },

          error: (e) => {
            console.error('Error while editing game in list', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while editing game in list.'});
          }
        })
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Edit game in list canceled.' });
        this.confirmationService.close();
      }
    })
  }

  deleteGameFromList(gameId : number) : void {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete game from your list?",
      header: "Delete confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userBoardGameService.deleteGameFromUserList(gameId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game deleted from the list!' });
            this.isFavourite = false;
            this.rateValue = 0;
            this.ngOnInit();
          },

          error: (e) => {
            console.error('Error while deleting game', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while deleting game.'});
          }
        })   
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete game from list canceled.' });
        this.confirmationService.close();
      }
    })
  }

}
