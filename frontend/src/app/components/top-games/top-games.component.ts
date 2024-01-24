import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { GameAddFormComponent } from '../game-add-form/game-add-form.component';
import { Game } from '../../models/game/game';
import { Observable } from 'rxjs';
import { GameService } from '../../services/game.service';
import { AddGameFormService } from '../../services/add-game-form.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserBoardGameService } from '../../services/user-board-game.service';
import { BadRequestError } from '../../exceptions/BadRequestError';
import { ResourceNotFoundError } from '../../exceptions/ResourceNotFoundError';

@Component({
  selector: 'app-top-games',
  standalone: true,
    imports: [DataViewModule, DropdownModule, CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, GameAddFormComponent],
  templateUrl: './top-games.component.html',
  styleUrls: ['./top-games.component.css']
})
export class TopGamesComponent {
  games: Game[] = [];
  router = inject(Router);
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  selectedGameId: number | null = null;

  constructor(private gameService : GameService, public addGameFormService: AddGameFormService, public authService: AuthService, private confirmationService: ConfirmationService, private messageService : MessageService, private userBoardGameService: UserBoardGameService) {}

  ngOnInit() {
    this.initialData();
  }

  onAddGameEvent($event: boolean){
    if($event){
      this.initialData();
    }
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

  openAddForm(gameId: number, gameName: string): void {
    this.selectedGameId = gameId;
    this.addGameFormService.openForm(gameId, gameName);
  }

  getTopGames() {
    this.gameService.getTopGames(5).subscribe({
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

  getTopGamesLoggedUser() : void{
    this.gameService.getTopGames(5).subscribe({
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

deleteGameFromList(gameId : number) : void {
  this.confirmationService.confirm({
    message: "Are you sure you want to delete game from your list?",
    header: "Delete confirmation",
    icon: 'pi pi-info-circle',
    accept: () => {
      this.userBoardGameService.deleteGameFromUserList(gameId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game deleted from the list!' });
          this.initialData();
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
