import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../../models/game/game';
import { GameService } from '../../../services/game.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { Router, RouterModule } from '@angular/router';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { Observable} from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { AddGameFormService } from '../../../services/add-game-form.service';
import { GameGenericComponent } from '../game-generic/game-generic.component';


@Component({
    selector: 'app-game',
    standalone: true,
    imports: [ RouterModule, GameGenericComponent],
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css'] 
})
export class GameComponent implements OnInit {
    games: Game[] = [];
    router = inject(Router);
    isLoggedIn$: Observable<boolean> | undefined;
    isLoggedIn: boolean = false;
  
    constructor(private gameService : GameService, public authService: AuthService, private messageService : MessageService, private userBoardGameService: UserBoardGameService) {}

    ngOnInit() {
      this.initialData();
    }
    
    initialData(){
      this.isLoggedIn$ = this.authService.isLoggedIn$;
      this.isLoggedIn$.subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
        if (this.isLoggedIn) {
          this.getGamesLoggedUser();
        } 
        else {
          this.getGames();         
        }
      });
    } 

    getGames() {
      this.gameService.getGames().subscribe({
        next: (data : Game[]) =>{
          this.games = data;
        },
        error: (e) => {
          if (e instanceof BadRequestError){
            this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          }
          else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
       })
    }

    getGamesLoggedUser() : void{
      this.gameService.getGames().subscribe({
        next: (data : Game[]) =>{
          data.forEach(game => {
            this.checkIfGameIsInUserList(game);
          })
          this.games = data;
        },
        error: (e) => {
          if (e instanceof BadRequestError){
            this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          }
          else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
        }
       })
    }

  checkIfGameIsInUserList(game: Game) {
    this.userBoardGameService.isGameInUserList(game.id).subscribe( {
      next: (result: boolean) =>{
        game.isInUserList = result;
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof ResourceNotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else{
          console.error('Server connection Error!')
        }
      }
    })
  }

  onChangeGameEvent($event: boolean){
    if($event){
      this.ngOnInit();
    }
  }

}
