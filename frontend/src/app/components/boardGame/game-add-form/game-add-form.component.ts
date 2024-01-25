import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AddGameToList } from '../../../models/game/addGameToList';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { RatingModule } from 'primeng/rating';
import { AddGameFormService } from '../../../services/add-game-form.service';

@Component({
  selector: 'app-game-add-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule,RouterModule, InputTextModule, RatingModule],
  templateUrl: './game-add-form.component.html',
  styleUrls: ['./game-add-form.component.css']
})
export class GameAddFormComponent {

  @Input() gameId: number | null = null;
  @Input() gameName: string | null = null;
  @Output() addedGameEvent = new EventEmitter<boolean>();

  isFavActive = false;
  router = inject(Router);

  gameAddForm = this.formBuilder.group({
    rating: [null],
    addToFavourites: [false]
  })

  constructor(private addGameFormService: AddGameFormService, private formBuilder: FormBuilder,  private userBoardGameService: UserBoardGameService, private messageService: MessageService, private confirmationService: ConfirmationService){}

  onFavClick(){
    this.isFavActive = !this.isFavActive;
    this.gameAddForm.get('addToFavourites')?.setValue(this.isFavActive);
  }

  closeAddForm(): void {
    this.addGameFormService.closeForm();
  }

  addGameToList() : void {
      const addedGameData = {
        rating: this.gameAddForm.get('rating')?.value, 
        isFavourite: this.gameAddForm.get('addToFavourites')?.value
      } as AddGameToList;

      this.userBoardGameService.addGameToUserList(this.gameId, addedGameData).subscribe({
        next: () => {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Game added to list.'})
          this.addedGameEvent.emit(true);
          this.addGameFormService.closeForm();
        },

        error: (e) => {
          console.error('Error while adding game to list', e);
          this.addGameFormService.closeForm();
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while adding game to list.'});
        }
      })
  }

  
}
