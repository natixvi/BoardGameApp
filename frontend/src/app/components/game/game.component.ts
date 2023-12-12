import { Component, OnInit } from '@angular/core';
import { DataViewModule} from 'primeng/dataview';
import { Game } from '../../models/game/game';
import { GameService } from '../../services/game.service';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../exceptions/BadRequestError';
import { SelectItem } from "primeng/api"; 
import { PrimeNGConfig } from "primeng/api"; 


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [DataViewModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
    games: Game[] = [];
    sortOptions: SelectItem[] | undefined;

    sortOrder: number | undefined;

    sortField: string | undefined;

    constructor(private gameService : GameService, private messageService : MessageService) {}

     ngOnInit() {
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

         this.sortOptions = [
          {label: 'Name High to Low', value: '!name'},
          {label: 'Name Low to High', value: 'name'}
      ];
    }

    onSortChange(event: { value: any; }) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }
}
