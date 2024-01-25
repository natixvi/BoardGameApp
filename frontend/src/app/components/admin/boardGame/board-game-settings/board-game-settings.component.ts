import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { GameService } from '../../../../services/game.service';
import { Game } from '../../../../models/game/game';
import { Router } from '@angular/router';
import { BadRequestError } from '../../../../exceptions/BadRequestError';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { GameInfo } from '../../../../models/game/gameInfo';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { AddBoardGame } from '../../../../models/game/addBoardGame';

@Component({
  selector: 'app-board-game-settings',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, FormsModule, TableModule, ToolbarModule, ButtonModule, RippleModule, InputTextModule, DialogModule],
  templateUrl: './board-game-settings.component.html',
  styleUrls: ['./board-game-settings.component.css']
})
export class BoardGameSettingsComponent implements OnInit{
  
  games: GameInfo[] = [];
  router = inject(Router);
  selectedGames!: GameInfo[] | null;
  productDialog: boolean = false;
  game!: AddBoardGame;
  submitted: boolean = false;


  constructor(private gameService : GameService, private messageService : MessageService, private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.initialData();
  }

  initialData(){
    this.gameService.getGamesInfo().subscribe({
      next: (data : GameInfo[]) =>{
        this.games = data;
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! " + e.message})
      }
      })
  }

  openNew() {
    this.game = {
      name: '',
      publisher: '',
      description: '',
      players : '',
      time  : '',
      age : '',
      imageUrl : ''  
    };
    this.submitted = false;
    this.productDialog = true;
  }

  
  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  addGame() {
    this.submitted = true;
    this.productDialog = false;
    this.game = {
        name: '',
        publisher: '',
        description: '',
        players : '',
        time  : '',
        age : '',
        imageUrl : ''  
    };
  }


// deleteSelectedProducts() {
//   this.confirmationService.confirm({
//       message: 'Are you sure you want to delete the selected products?',
//       header: 'Confirm',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//           this.games = this.games.filter((val) => !this.selectedGames?.includes(val));
//           this.selectedGames = null;
//           this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Board Games Deleted', life: 3000 });
//       }
//   });
// }

}
