import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AddBoardGame } from '../../../../models/game/addBoardGame';
import { GameService } from '../../../../services/game.service';
import { BadRequestError } from '../../../../exceptions/BadRequestError';
import { DuplicatedDataError } from '../../../../exceptions/DuplicatedDataError';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-create-board-game',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, InputTextModule, ButtonModule, InputTextareaModule, DialogModule],
  templateUrl: './create-board-game.component.html',
  styleUrls: ['./create-board-game.component.css']
})
export class CreateBoardGameComponent {
  @Input()  addGameDialog = false;
  @Output() addGameClicked = new EventEmitter<boolean>();
  @Output() dialogClosed = new EventEmitter<boolean>();
  
  addGameForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    publisher: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    players: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+$/)]],
    time: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+ Min$/)]],
    age: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    imageUrl: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private gameService : GameService, private messageService : MessageService){}

  addGame(){
    this.dialogClosed.emit(true);
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
        this.addGameDialog = false;
        this.addGameClicked.emit(true);
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof DuplicatedDataError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
    })
  }
  
  hideAddDialog(){
    this.addGameDialog = false;

    this.dialogClosed.emit(true);
  }

 
}
