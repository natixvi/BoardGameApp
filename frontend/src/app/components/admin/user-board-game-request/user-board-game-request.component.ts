import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { BoardGameRequest } from '../../../models/boardGameRequest/boardGameRequest';
import { BoardGameRequestService } from '../../../services/board-game-request.service';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { UnauthorizedError } from '../../../exceptions/UnauthorizedError';
import { ForbiddenError } from '../../../exceptions/ForbiddenError';
import { ChangeRequestStatus } from '../../../models/userRequest/changeRequestStatus';
import { GameService } from '../../../services/game.service';
import { RippleModule } from 'primeng/ripple';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AddBoardGame } from '../../../models/game/addBoardGame';
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';

@Component({
  selector: 'app-user-board-game-request',
  standalone: true,
  imports: [CommonModule, SelectButtonModule, ReactiveFormsModule, FormsModule, InputTextareaModule, TableModule, ToolbarModule, ButtonModule, RippleModule, InputTextModule,RouterModule, TooltipModule, DialogModule, RadioButtonModule, TagModule],
  templateUrl: './user-board-game-request.component.html',
  styleUrls: ['./user-board-game-request.component.css']
})
export class UserBoardGameRequestComponent {
  availableStatuses: string[] = ['Active', 'Discard', 'Done'];
  selectedStatus!: string;
  usersRequests: BoardGameRequest[] = [];
  showDialog: boolean = false;
  selectedRequest: BoardGameRequest = { } as BoardGameRequest;
  addGameDialog: boolean = false;

  addGameForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    publisher: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', Validators.required],
    players: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+$/)]],
    time: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^\d+-\d+ Min$/)]],
    age: ['', [Validators.required, Validators.maxLength(3), Validators.pattern(/^\d+$/)]],
    imageUrl: ['', [Validators.required]]
  });


  constructor(private fb: FormBuilder, private gameService : GameService, private boardGameRequestService: BoardGameRequestService, private messageService: MessageService){}

  ngOnInit(): void {
    this.getUsersRequest();
  }

  getUsersRequest(){
    this.boardGameRequestService.getAllBoardGameRequests().subscribe({
      next: (data : BoardGameRequest[]) =>{
        this.usersRequests = data;
        this.usersRequests.forEach((request: BoardGameRequest) => {
          request.createdTime = new Date(request.createdTime);            
        });
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof UnauthorizedError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof ForbiddenError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! "})
      }
    })
  }

  openAddGameDialog(request: BoardGameRequest) {
    this.selectedRequest = request;
    this.addGameForm.controls['name'].setValue(this.selectedRequest.name),
    this.addGameForm.controls['publisher'].setValue(this.selectedRequest.publisher),
    this.addGameForm.controls['description'].setValue(this.selectedRequest.description),
    this.addGameForm.controls['players'].setValue(this.selectedRequest.players),
    this.addGameForm.controls['time'].setValue(this.selectedRequest.time),
    this.addGameForm.controls['age'].setValue(this.selectedRequest.age.toString()),
    this.addGameForm.controls['imageUrl'].setValue(this.selectedRequest.imageUrl);
    this.addGameDialog = true;
  }

  hideAddDialog() {
      this.addGameDialog = false;
      this.selectedRequest = { } as BoardGameRequest;
  }

  addBoardGame(){
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

    this.boardGameRequestService.changeBoardGameRequestStatus(this.selectedRequest?.id, { status: 'Done' }).subscribe({
      next: () =>{
        this.gameService.addGame(addBoardGameData).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Board game added!' })
            this.getUsersRequest();
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
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof UnauthorizedError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof ForbiddenError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! "})
      }
    })
    this.selectedRequest = { } as BoardGameRequest;
  }
  
  showRequestDetail(request: BoardGameRequest){
    this.selectedRequest = request;
    this.selectedStatus = request.status;
    this.showDialog = true;
  }
  hideDialog(){
    this.showDialog = false;
    this.selectedRequest = { } as BoardGameRequest;
    this.selectedStatus = "";
  }
  
  saveChanges(){
    this.showDialog = false;
    const newStatus = {
      status: this.selectedStatus
    } as ChangeRequestStatus; 

    this.boardGameRequestService.changeBoardGameRequestStatus(this.selectedRequest?.id, newStatus).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'User board game request status has been changed!' })
        this.getUsersRequest();
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof UnauthorizedError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof ForbiddenError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! "})
      }
    })
    this.selectedRequest = { } as BoardGameRequest;
    this.selectedStatus = "";
  }

  getSeverity(status: string) {
    switch (status) {
        case 'Active':
            return 'warning';
        case 'Discard':
            return 'danger';
        case 'Done':
            return 'success';
        default:
          return 'secondary'
    }
  }

}
