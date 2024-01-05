import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AddGameToList } from '../../../models/game/addGameToList';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { Location } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { AddGameFormService } from '../../../services/add-game-form.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
  // gameId: number = 0;
  isActive = false;
  router = inject(Router);

  gameAddForm = this.formBuilder.group({
    rating: [null],
    addToFavourites: [false]
  })

  constructor(private addGameFormService: AddGameFormService, private formBuilder: FormBuilder, private location: Location, private route: ActivatedRoute, private userBoardGameService: UserBoardGameService, private messageService: MessageService, private confirmationService: ConfirmationService){}

  onClick(){
    this.isActive = !this.isActive;
    this.gameAddForm.get('addToFavourites')?.setValue(this.isActive);
  }

  closeForm(): void {
    this.addGameFormService.closeForm();
  }

  addGameToList() : void {
    this.confirmationService.confirm({
      message: "Are you sure you want to add game to your list?",
      header: "Confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        // const currentDate = new Date();
        // currentDate.setHours(currentDate.getHours() + 1);
        // const isoDateString = currentDate.toISOString();

        const addedGameData = {
          rating: this.gameAddForm.get('rating')?.value, 
          isFavourite: this.gameAddForm.get('addToFavourites')?.value
        } as AddGameToList;

        this.userBoardGameService.addGameToUserList(this.gameId, addedGameData).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game added to the list!' });
            this.addGameFormService.gameAdded();
            this.addGameFormService.closeForm();
          },

          error: (e) => {
            console.error('Error while adding game to list', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while adding game to list.'});
          }
        })
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Add game to list canceled.' });
        this.confirmationService.close();
      }
    })
  }

 
}
