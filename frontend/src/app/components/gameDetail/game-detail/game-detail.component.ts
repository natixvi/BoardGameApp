import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameDetails } from '../../../models/game/gameDetail';
import { GameService } from '../../../services/game.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { CommonModule,  DatePipe } from '@angular/common';
import { Review } from '../../../models/game/review';
import { ButtonModule } from 'primeng/button';
import { DataViewModule} from 'primeng/dataview';
import { NotFoundError } from '../../../exceptions/NotFoundError';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { UserBoardGameService } from '../../../services/user-board-game.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule, ButtonModule, DataViewModule, RouterModule],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {

  gameId: number = 0;
  router = inject(Router);
  gameDetails: GameDetails = { } as GameDetails
  reviews: Review[] = []
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;


  constructor( private route: ActivatedRoute, public authService: AuthService, private userBoardGameService: UserBoardGameService, private confirmationService: ConfirmationService, private gameService: GameService, private messageService: MessageService){
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

