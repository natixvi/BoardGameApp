import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AddBoardGame } from '../../../../models/game/addBoardGame';
import { GameService } from '../../../../services/game.service';
import { BadRequestError } from '../../../../exceptions/BadRequestError';
import { DuplicatedDataError } from '../../../../exceptions/DuplicatedDataError';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';

@Component({
  selector: 'app-create-board-game',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, InputTextModule, ButtonModule, InputTextareaModule],
  templateUrl: './create-board-game.component.html',
  styleUrls: ['./create-board-game.component.css']
})
export class CreateBoardGameComponent {
  
  router = inject(Router);
  addGameForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    publisher: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    players: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+$/)]],
    time: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+ Min$/)]],
    age: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    imageUrl: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private messageService: MessageService, private gameService: GameService){}

  addGame(){
    if (this.addGameForm.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect added board game data!'});
      return;
    }
    
    const addBoardGameData = {
      name: this.addGameForm.get('name')?.value,
      publisher: this.addGameForm.get('publisher')?.value,
      description: this.addGameForm.get('description')?.value,
      players: this.addGameForm.get('players')?.value,
      time: this.addGameForm.get('time')?.value,
      age: this.addGameForm.get('age')?.value,
      imageUrl: this.addGameForm.get('imageUrl')?.value,
    } as AddBoardGame

    this.gameService.addGame(addBoardGameData).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Board game added!' })
        this.addGameForm.reset();
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof DuplicatedDataError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! " + e.message})
      }
    })

  }
}
