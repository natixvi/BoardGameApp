import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Game } from '../../models/game/game';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { GameAddFormComponent } from '../game-add-form/game-add-form.component';
import { GameService } from '../../services/game.service';
import { AddGameFormService } from '../../services/add-game-form.service';
import { AuthService } from '../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserBoardGameService } from '../../services/user-board-game.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-generic',
  standalone: true,
  imports: [DataViewModule, DropdownModule, CommonModule, FormsModule, RouterModule, ButtonModule, InputTextModule, GameAddFormComponent],
  templateUrl: './game-generic.component.html',
  styleUrls: ['./game-generic.component.css']
})
export class GameGenericComponent implements OnInit {
  @Input() games: Game[] = []
  @Output() changeInDataEvent = new EventEmitter<boolean>();
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;

  selectedGameId: number | null = null;

  constructor(private gameService : GameService, public addGameFormService: AddGameFormService, public authService: AuthService, private confirmationService: ConfirmationService, private messageService : MessageService, private userBoardGameService: UserBoardGameService) {}

  ngOnInit(){
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  } 

  onAddGameEvent($event: boolean){
    if($event){
      this.changeInDataEvent.emit(true);
    }
  }

  openAddForm(gameId: number, gameName: string): void {
    this.selectedGameId = gameId;
    this.addGameFormService.openForm(gameId, gameName);
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
            this.changeInDataEvent.emit(true)
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
