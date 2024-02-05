import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';
import { BoardGameRequestService } from '../../../services/board-game-request.service';
import { CreateBoardGameRequest } from '../../../models/boardGameRequest/createBoardGameRequest';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-create-board-game-request',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, InputTextareaModule, ButtonModule, InputTextModule, ScrollPanelModule],
  templateUrl: './create-board-game-request.component.html',
  styleUrls: ['./create-board-game-request.component.css']
})
export class CreateBoardGameRequestComponent {
  addGameForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    publisher: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    players: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+$/)]],
    time: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+ Min$/)]],
    age: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    imageUrl: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private boardGameReqService : BoardGameRequestService, private messageService : MessageService, private confirmationService: ConfirmationService){}

  addBoardGameRequest() {
    if (this.addGameForm.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect added board game data!'});
      return; 
    }
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    const isoDateString = currentDate.toISOString();

    const addBoardGameData = {
      name: this.addGameForm.get('name')?.value,
      publisher: this.addGameForm.get('publisher')?.value,
      description: this.addGameForm.get('description')?.value,
      players: this.addGameForm.get('players')?.value,
      time: this.addGameForm.get('time')?.value,
      age: this.addGameForm.get('age')?.value,
      imageUrl: this.addGameForm.get('imageUrl')?.value,
      createdTime: isoDateString
    } as CreateBoardGameRequest

    this.boardGameReqService.createBoardGameRequest(addBoardGameData).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Board game request sended!' })
        this.addGameForm.reset();
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
}
