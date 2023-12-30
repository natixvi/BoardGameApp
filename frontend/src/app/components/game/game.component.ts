import { Component, OnInit, inject } from '@angular/core';
import { DataViewModule} from 'primeng/dataview';
import { Game } from '../../models/game/game';
import { GameService } from '../../services/game.service';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../exceptions/BadRequestError';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { UserBoardGameService } from '../../services/user-board-game.service';
import { NotFoundError } from '../../exceptions/NotFoundError';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [DataViewModule, DropdownModule, CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule],
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

  checkIfGameIsInUserList(game: Game) {
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

}
