import { Component, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameDetails } from '../../../models/game/gameDetail';
import { GameService } from '../../../services/game.service';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { GameAddFormComponent } from "../../game-add-form/game-add-form.component";
import { AddGameFormService } from '../../../services/add-game-form.service';
import { UserGameDetails } from '../../../models/userGame/UserGameDetails';
import { EditUserGameDetails } from '../../../models/userGame/editUserGameDetails';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AddGameReview } from '../../../models/review/addGameReview';
import { GameReviewService } from '../../../services/game-review.service';


@Component({
    selector: 'app-game-detail',
    standalone: true,
    templateUrl: './game-detail.component.html',
    styleUrls: ['./game-detail.component.css'],
    imports: [CommonModule, ButtonModule, DataViewModule, RouterModule, InputTextareaModule, ReactiveFormsModule, RatingModule, FormsModule, OverlayPanelModule, GameAddFormComponent]
})
export class GameDetailComponent implements OnInit {
  
  gameId: number = 0;
  router = inject(Router);
  gameDetails: GameDetails = { } as GameDetails
  reviews: Review[] = []
  userReview: Review | undefined;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  userId: number = 0;
  rateValue: number | undefined;
  isFavourite: boolean | undefined;
  showform: boolean = false;
  selectedGameId: number | null = null;
  isFavActive: boolean = false;
  openUserGameForm: boolean = false;
  showAddReviewForm: boolean = false;
  userReviewExist: boolean = false;

  gameEditForm = this.formBuilder.group({
    rating: [0],
    addToFavourites: [false]
  })
  
  reviewControl = new FormControl('', [Validators.maxLength(1000)]);

  constructor( private route: ActivatedRoute, private gameReviewService: GameReviewService, private formBuilder: FormBuilder, public addGameFormService: AddGameFormService, public authService: AuthService, private userBoardGameService: UserBoardGameService, private confirmationService: ConfirmationService, private gameService: GameService, private messageService: MessageService){
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: (params) =>{
        this.gameId = params['id'];
      }
    });
    this.userId = this.authService.getParsedToken().Id;
    
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
          this.gameDetails.reviews.forEach((review: Review) => {
            review.createdDate = new Date(review.createdDate);
            
          });
          this.reviews = this.gameDetails?.reviews.filter(review => String(review.userId) !== String(this.userId));
          this.reviews?.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
          this.userReview = this.gameDetails.reviews.find((review) => String(review.userId) === String(this.userId));

          if (this.userReview) {
            this.userReview.createdDate = new Date(this.userReview.createdDate);
            this.reviews.unshift(this.userReview);
            this.userReviewExist = true;
          }

          if (userGameDetails) {
            this.rateValue = userGameDetails.rating;
            this.isFavourite = userGameDetails.isFavourite;
            this.isFavActive = userGameDetails.isFavourite
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

  onFavClick(){
    this.isFavActive = !this.isFavActive;
    this.gameEditForm.get('addToFavourites')?.setValue(this.isFavActive)
  }

  openAddForm(gameId: number, gameName: string): void {
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

  closeEditForm(){
    this.openUserGameForm = false;
  }

  editUserGameDetails(){
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

  showReviewForm(){
    if(!this.isLoggedIn)  this.router.navigate(['login']);
    this.showAddReviewForm = !this.showAddReviewForm;
  }
  
  addGameReview(){
    this.confirmationService.confirm({
      message: "Are you sure you want to add game review?",
      header: "Add review confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);
        const isoDateString = currentDate.toISOString();

        const addGameReviewData = {
          reviewDescription: this.reviewControl.value,
          createdDate: isoDateString
        } as AddGameReview;


        this.gameReviewService.addGameReview(this.gameId, addGameReviewData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game review added!' });
            this.showAddReviewForm = false;
            this.ngOnInit();
          },

          error: (e) => {
            console.error('Error while adding game review', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while adding game review.'});
          }
        })   
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Add game review canceled.' });
        this.confirmationService.close();
      }
    })
  }
  enableEditMode(review : Review){

  }
  saveUserReview(reviewId : number){

  }

  disableEditMode(review: Review){

  }
  editUserReview(){

  }

  deleteUserReview(reviewId: number){
    this.confirmationService.confirm({
      message: "Are you sure you want to delete game review?",
      header: "Delete review confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        this.gameReviewService.deleteUserGameReview(reviewId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game review deleted!' });
            this.ngOnInit();
          },

          error: (e) => {
            console.error('Error while deleting user game review', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while deleting user game review.'});
          }
        })   
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete user game review canceled.' });
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

