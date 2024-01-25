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
  
  
}
