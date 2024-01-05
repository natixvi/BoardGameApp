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
import { NotFoundError } from '../../../exceptions/NotFoundError';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { RatingModule } from 'primeng/rating';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FormControl, Validators } from '@angular/forms';
import { GameAddFormComponent } from "../../game/game-add-form/game-add-form.component";
import { AddGameFormService } from '../../../services/add-game-form.service';



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
  showform: boolean = false;
  selectedGameId: number | null = null;

  reviewControl = new FormControl('', [Validators.maxLength(1000)]);

  constructor( private route: ActivatedRoute,public addGameFormService: AddGameFormService, public authService: AuthService, private userBoardGameService: UserBoardGameService, private confirmationService: ConfirmationService, private gameService: GameService, private messageService: MessageService){
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
      
     });
    this.getGameDetails(this.isLoggedIn);
    this.addGameFormService.getGameAddedObservable().subscribe(() => {
      this.ngOnInit();
    });
  }

  openForm(gameId: number, gameName: string): void {
    this.selectedGameId = gameId;
    this.addGameFormService.openForm(gameId, gameName);
  }

  getGameDetails(isLoggedIn : boolean): void{
    this.gameService.getGameById(this.gameId).subscribe({
      next: (data: GameDetails) =>{
        if(isLoggedIn){
          this.checkIfGameIsInUserList(data)
        }
        else{
          data.isInUserList = false;
        }
        this.gameDetails = data;
        this.gameDetails.reviews.forEach((review: Review) => {
          review.createdDate = new Date(review.createdDate);
          
        });
        this.reviews = this.gameDetails?.reviews; 
      },
      error: (e) => {
        if(e instanceof NotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          this.router.navigate(['notfound']);
        } 
        else if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          this.router.navigate(['notfound']);
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        this.router.navigate(['notfound']);  
      }
    })
  }

  checkIfGameIsInUserList(game: GameDetails) {
    this.userBoardGameService.isGameInUserList(game.id).subscribe( {
      next: (result: boolean) =>{
        game.isInUserList = result;
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof NotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
    }
    )
  }
  
  submitRating(){
    if(!this.gameDetails.isInUserList){
      this.messageService.add({severity: 'error', summary: 'Error', detail:"You must add game to list if you want rate them."});
      this.router.navigate(['/games/', this.gameDetails.id, 'add-to-list']);
    }
    else{
      console.error(this.rateValue)
      this.messageService.add({severity: 'success', summary: 'Success', detail:"Success you rate game"});
    }
  }

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

