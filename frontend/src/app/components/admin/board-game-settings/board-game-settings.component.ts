import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { GameService } from '../../../services/game.service';
import { Router } from '@angular/router';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { GameInfo } from '../../../models/game/gameInfo';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { AddBoardGame } from '../../../models/game/addBoardGame';
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { UpdateBoardGame } from '../../../models/game/updateBoardGame';

@Component({
  selector: 'app-board-game-settings',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, FormsModule, InputTextareaModule, TableModule, ToolbarModule, ButtonModule, RippleModule, InputTextModule, DialogModule],
  templateUrl: './board-game-settings.component.html',
  styleUrls: ['./board-game-settings.component.css']
})
export class BoardGameSettingsComponent implements OnInit{
  
  games: GameInfo[] = [];
  router = inject(Router);
  selectedGames!: GameInfo[] | null;
  addGameDialog: boolean = false;
  editGameDialog: boolean = false;
  editGameId: number = -1;

  addGameForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    publisher: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    players: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+$/)]],
    time: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+ Min$/)]],
    age: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    imageUrl: ['', [Validators.required]]
  });

  editGameForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    publisher: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    players: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+$/)]],
    time: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+ Min$/)]],
    age: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    imageUrl: ['', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private gameService : GameService, private messageService : MessageService, private confirmationService: ConfirmationService){}

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
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! "})
      }
      })
  }

  openNew() {
    this.addGameDialog = true;
  }

  hideAddDialog() {
      this.addGameDialog = false;

  }

  addGame() {
    this.addGameDialog = false;
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
        this.initialData();
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

  showEditGameDialog(game: GameInfo){    
    this.editGameForm.controls['name'].setValue(game.name),
    this.editGameForm.controls['publisher'].setValue(game.publisher),
    this.editGameForm.controls['description'].setValue(game.description),
    this.editGameForm.controls['players'].setValue(game.players),
    this.editGameForm.controls['time'].setValue(game.time),
    this.editGameForm.controls['age'].setValue(game.age.toString()),
    this.editGameForm.controls['imageUrl'].setValue(game.imageUrl),
    this.editGameId = game.id;
    this.editGameDialog = true;
  }
   
  hideEditDialog() {
    this.editGameDialog = false;
    this.editGameId = -1;
  }

  editGame() {
    this.editGameDialog = false;
    if (this.editGameForm.invalid) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect added board game data!'});
      return; 
    }
    const editBoardGameData = {
      name: this.editGameForm.get('name')?.value,
      publisher: this.editGameForm.get('publisher')?.value,
      description: this.editGameForm.get('description')?.value,
      players: this.editGameForm.get('players')?.value,
      time: this.editGameForm.get('time')?.value,
      age: this.editGameForm.get('age')?.value,
      imageUrl: this.editGameForm.get('imageUrl')?.value,
    } as UpdateBoardGame
    
    this.gameService.updateGame(this.editGameId, editBoardGameData).subscribe({
      next: () => {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Board game edited!' })
        this.initialData();
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
    this.editGameId = -1;
  }

  deleteGame(gameId : number){
    this.confirmationService.confirm({
      message: "Are you sure you want to delete selected board game?",
      header: "Delete confirmation",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.gameService.deleteGame(gameId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Board game deleted!' });
            this.initialData();
          },
          error: (e) => {
            console.error(e);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server connection error'});
          }
        })        
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Board game delete canceled.' });
      }
    })
  }

  deleteSelectedGames(){
    if(this.selectedGames !== null){
      const selectedIds = this.selectedGames.map(game => game.id);
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected products?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.gameService.deleteSelectedGames(selectedIds).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Board games deleted!' });
              this.selectedGames = null;
              this.initialData();
            },
            error: (e) => {
              console.error(e);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server connection error'});
            }
          })        
        },
        reject: () => {
          this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Board games delete canceled.' });
        }
      });
    }
  }

}
