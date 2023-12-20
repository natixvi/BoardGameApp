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

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [DataViewModule, DropdownModule, FormsModule, RouterModule, ButtonModule, InputTextModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    games: Game[] = [];
    router = inject(Router);
    
    constructor(private gameService : GameService, private messageService : MessageService) {}

     ngOnInit() {
        this.getGames();
    }

    getGames() : void{
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

}
