import { Component, OnInit, inject} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameDetails } from '../../../models/game/gameDetail';
import { GameService } from '../../../services/game.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule} from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule} from 'primeng/dataview';
import { EMPTY, Observable, map, of, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { RatingModule } from 'primeng/rating';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, Validators } from '@angular/forms';
import { GameAddFormComponent } from "../game-add-form/game-add-form.component";
import { AddGameFormService } from '../../../services/add-game-form.service';
import { UserGameDetails } from '../../../models/userGame/UserGameDetails';
import { EditUserGameDetails } from '../../../models/userGame/editUserGameDetails';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AddGameComment } from '../../../models/comment/addGameComment';
import { EditUserGameComment } from '../../../models/comment/editUserGameComment';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';
import { GameCommentService } from '../../../services/game-comment.service';
import { Commentt } from '../../../models/comment/commentt';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';


@Component({
    selector: 'app-game-detail',
    standalone: true,
    templateUrl: './game-detail.component.html',
    styleUrls: ['./game-detail.component.css'],
    imports: [CommonModule, ButtonModule, DataViewModule, RouterModule, InputTextareaModule, ReactiveFormsModule, RatingModule, FormsModule, GameAddFormComponent]
})
export class GameDetailComponent implements OnInit {
  
  gameId: number = 0;
  router = inject(Router);
  gameDetails: GameDetails = { } as GameDetails
  comments: Commentt[] = []
  userComment: Commentt | undefined;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  userId: number = 0;
  rateValue: number | undefined;
  isFavourite: boolean | undefined;
  showform: boolean = false;
  selectedGameId: number | null = null;
  isFavActive: boolean = false;
  openUserGameForm: boolean = false;
  showAddCommentForm: boolean = false;
  userCommentExist: boolean = false;

  gameEditForm = this.formBuilder.group({
    rating: [0],
    addToFavourites: [false]
  })
  
  commentControl = new FormControl('', [Validators.required ,Validators.maxLength(1000)]);

  constructor( private route: ActivatedRoute, private gameCommentService: GameCommentService, private formBuilder: FormBuilder, public addGameFormService: AddGameFormService, public authService: AuthService, private userBoardGameService: UserBoardGameService, private confirmationService: ConfirmationService, private gameService: GameService, private messageService: MessageService){
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
      if(this.isLoggedIn){
          this.userId = this.authService.getParsedToken().Id;
      }
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
          this.gameDetails.comments.forEach((comment: Commentt) => {
            comment.createdDate = new Date(comment.createdDate);            
          });
          this.comments = this.gameDetails?.comments.filter(comment => String(comment.userId) !== String(this.userId));
          this.comments?.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
          
          this.userComment = this.gameDetails.comments.find((comment) => String(comment.userId) === String(this.userId));

          if (this.userComment) {
            this.userComment.createdDate = new Date(this.userComment.createdDate);
            this.comments.unshift(this.userComment);
            this.userCommentExist = true;
            this.userComment.isEditMode = false ;
          }

          if (userGameDetails) {
            this.rateValue = userGameDetails.rating;
            this.isFavourite = userGameDetails.isFavourite;
            this.isFavActive = userGameDetails.isFavourite
            this.gameEditForm.controls['rating'].setValue(userGameDetails.rating),
            this.gameEditForm.controls['addToFavourites'].setValue(userGameDetails.isFavourite)
          } 
        },
        error: (e) => {
          if (e instanceof ResourceNotFoundError){
            console.error("Board game not found");
          }
          else if (e instanceof BadRequestError){
            console.error("Board game not found, bad request error");
          }
          else
          {
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error'})
            
          }
        }
      });
     });
  }

  onAddGameEvent($event: boolean){
    if($event){
      this.ngOnInit();
    }
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

  showCommentForm(){
    if(!this.isLoggedIn)  this.router.navigate(['login']);
    this.showAddCommentForm = !this.showAddCommentForm;
  }
  
  addGameComment(){
      const currentDate = new Date();
      currentDate.setHours(currentDate.getHours() + 1);
      const isoDateString = currentDate.toISOString();

      const addGameCommentData = {
        commentDescription: this.commentControl.value,
        createdDate: isoDateString
      } as AddGameComment;

      this.gameCommentService.addGameComment(this.gameId, addGameCommentData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game comment added!' });
          this.ngOnInit();
        },
        error: (e) => {
          if (e instanceof BadRequestError){
            this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          }
          else if(e instanceof DuplicatedDataError){
            this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          }
          else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
      })  
      this.commentControl.reset(); 
      this.showAddCommentForm = false;
  }

  enableEditCommentMode(comment : Commentt){
    comment.isEditMode = true;
  }

  cancelEditCommentMode(comment: Commentt){
    comment.isEditMode = false;
  }

  editUserComment(comment: Commentt){
      const editUserComment = {
        commentDescription: comment.commentDescription
      } as EditUserGameComment;

      this.gameCommentService.editGameComment(comment.id, editUserComment).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game comment edited!' });
          comment.isEditMode = false;
          this.ngOnInit();
        },
        error: (e) => {
          console.error('Error while editing game comment', e);
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while editing game comment.'});
        }
      })   
        this.confirmationService.close();
     
  }

  deleteUserComment(commentId: number){
    this.confirmationService.confirm({
      message: "Are you sure you want to delete game comment?",
      header: "Delete comment confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        this.gameCommentService.deleteUserGameComment(commentId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game comment deleted!' });
            this.ngOnInit();
          },
          error: (e) => {
            console.error('Error while deleting user game comment', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while deleting user game comment.'});
          }
        })   
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete user game comment canceled.' });
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

