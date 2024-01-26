import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Game } from '../../../models/game/game';
import { Observable } from 'rxjs';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { GameGenericComponent } from '../game-generic/game-generic.component';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-top-games',
  standalone: true,
  imports: [RouterModule, GameGenericComponent, ToolbarModule, RatingModule],
  templateUrl: './top-games.component.html',
  styleUrls: ['./top-games.component.css']
})
export class TopGamesComponent {
  topGames: Game[] = [];
  router = inject(Router);
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;

  constructor(private gameService : GameService, public authService: AuthService,  private messageService : MessageService, private userBoardGameService: UserBoardGameService) {}

  ngOnInit() {
    this.initialData();
  }

  initialData(){
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.getTopGamesLoggedUser();
      } 
      else {
        this.getTopGames();         
      }
    });
  } 

  getTopGames() {
    this.gameService.getTopGames(10).subscribe({
      next: (data : Game[]) =>{
        this.topGames = data;
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
     })
  }

  getTopGamesLoggedUser() : void{
    this.gameService.getTopGames(10).subscribe({
      next: (data : Game[]) =>{
        data.forEach(game => {
          this.checkIfGameIsInUserList(game);
        })
        this.topGames = data;
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
