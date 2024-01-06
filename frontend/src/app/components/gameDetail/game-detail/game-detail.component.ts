import { Component, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameDetails } from '../../../models/game/gameDetail';
import { GameService } from '../../../services/game.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { CommonModule} from '@angular/common';
import { Review } from '../../../models/game/review';
import { ButtonModule } from 'primeng/button';
import { DataViewModule} from 'primeng/dataview';
import { EMPTY, Observable, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { RatingModule } from 'primeng/rating';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormControl, Validators } from '@angular/forms';
import { GameAddFormComponent } from "../../game/game-add-form/game-add-form.component";
import { AddGameFormService } from '../../../services/add-game-form.service';
import { UserGameDetails } from '../../../models/userGame/UserGameDetails';
import { EditUserGameDetails } from '../../../models/userGame/editUserGameDetails';


@Component({
    selector: 'app-game-detail',
    standalone: true,
    templateUrl: './game-detail.component.html',
    styleUrls: ['./game-detail.component.css'],
    imports: [CommonModule, ButtonModule, DataViewModule, RouterModule, ReactiveFormsModule, RatingModule, FormsModule, OverlayPanelModule, GameAddFormComponent]
})
export class GameDetailComponent implements OnInit {
  
  gameId: number = 0;
  router = inject(Router);
  gameDetails: GameDetails = { } as GameDetails
  reviews: Review[] = []
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  rateValue: number | undefined;
  isFavourite: boolean | undefined;
  showform: boolean = false;
  selectedGameId: number | null = null;
  isActive = false;
  openUserGameForm = false;

  gameEditForm = this.formBuilder.group({
    rating: [0],
    addToFavourites: [false]
  })
  
  reviewControl = new FormControl('', [Validators.maxLength(1000)]);

  constructor( private route: ActivatedRoute, private formBuilder: FormBuilder, public addGameFormService: AddGameFormService, public authService: AuthService, private userBoardGameService: UserBoardGameService, private confirmationService: ConfirmationService, private gameService: GameService, private messageService: MessageService){
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: (params) =>{
        this.gameId = params['id'];
      }
    });
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      this.getGameDetails(this.isLoggedIn).pipe(
        switchMap((gameDetails: GameDetails) => 
          gameDetails.isInUserList ?
          this.getUserGameDetails(gameDetails).pipe(
            map((userGameDetails: UserGameDetails) => ({ gameDetails, userGameDetails }))
          )
          :of({ gameDetails, userGameDetails: null })  
        )
      ).subscribe({
        next: ({ gameDetails, userGameDetails }) => {
          this.gameDetails = gameDetails;
          if (userGameDetails) {
            this.rateValue = userGameDetails.rating;
            this.isFavourite = userGameDetails.isFavourite;
            this.isActive = userGameDetails.isFavourite
            this.gameEditForm.controls['rating'].setValue(userGameDetails.rating),
            this.gameEditForm.controls['addToFavourites'].setValue(userGameDetails.isFavourite)
          } 
        },
        error: (error) => {
          console.error('Error while downloading game data', error);
        }
      });
     });

    this.addGameFormService.getGameAddedObservable().subscribe(() => {
      this.ngOnInit();
    });
  }

  onClick(){
    this.isActive = !this.isActive;
    this.gameEditForm.get('addToFavourites')?.setValue(this.isActive)
  }

  openForm(gameId: number, gameName: string): void {
    this.selectedGameId = gameId;
    this.addGameFormService.openForm(gameId, gameName);
  }

  getGameDetails(isLoggedIn: boolean): Observable<GameDetails> {
    return this.gameService.getGameById(this.gameId).pipe(
      switchMap((data: GameDetails) => {
        if (isLoggedIn) {
          return this.checkIfGameIsInUserList(data).pipe(
            map((isInList: boolean) => {
              data.isInUserList = isInList;
              return data;
            })
          );
        } else {
          data.isInUserList = false;
          return of(data);
        }
      })
    );
  }

  checkIfGameIsInUserList(game: GameDetails): Observable<boolean> {
    return this.userBoardGameService.isGameInUserList(game.id);
  }
  getUserGameDetails(gameDetails: GameDetails): Observable<UserGameDetails> {
    if (!gameDetails) {
      return EMPTY;
    }
  return this.userBoardGameService.getUserGameDetails(gameDetails.id);
  }

  showEditUserGameForm(){
    this.openUserGameForm = true;
  }

  closeForm(){
    this.openUserGameForm = false;
  }

  editUserGameDetails(){
    this.confirmationService.confirm({
      message: "Are you sure you want to edit game on your list?",
      header: "Confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {

        const editUserGameData = {
          rating: this.gameEditForm.get('rating')?.value, 
          isFavourite: this.gameEditForm.get('addToFavourites')?.value
        } as EditUserGameDetails;

        this.userBoardGameService.editUserGameDetails(this.gameId, editUserGameData).subscribe({
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
  
  // submitRating(){
  //   if(!this.gameDetails.isInUserList){
  //     this.messageService.add({severity: 'warn', summary: 'warn', detail:"You must add game to your list if you want rate them."});
  //     this.openForm(this.gameDetails.id, this.gameDetails.name)
  //   }
  //   else{
  //     this.messageService.add({severity: 'success', summary: 'Success', detail:"Success you rate game"});
  //   }
  // }

  addGameReview(){
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
            this.rateValue = undefined;
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

