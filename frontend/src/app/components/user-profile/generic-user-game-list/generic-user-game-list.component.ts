import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { UserInfo } from '../../../models/user/userInfo';
import { UserBoardGame } from '../../../models/userGame/userBoardGame';
import { EditUserGameDetails } from '../../../models/userGame/editUserGameDetails';
import { TooltipModule } from "primeng/tooltip"; 
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-generic-user-game-list',
  standalone: true,
  imports: [CommonModule, DataViewModule, RouterModule, InputTextModule, ButtonModule, ReactiveFormsModule, RatingModule, FormsModule, TooltipModule, ToolbarModule, DropdownModule],
  templateUrl: './generic-user-game-list.component.html',
  styleUrls: ['./generic-user-game-list.component.css']
})
export class GenericUserGameListComponent implements OnInit{

  @Input() isCurrentUserList: boolean = false;
  @Input() userInfo: UserInfo = { id: 0, nickName: '', email: '', userBoardGames: [], favouriteUsers: []};
  @Input() header: string = '';
  @Input() buttonName: string = '';
  @Input() userId: number = 0;
  @Input() favView: boolean = false;
  @Input() toggleButtonFn: ((userId: number) => void) | null = null;

  @Output() changeInDataEvent = new EventEmitter<boolean>();

  rateValue: number = 0;
  router = inject(Router);
  openUserGameForm: boolean = false;
  isFavActive: boolean = false;
  selectedGameId: number | null = null;

  sortOptions: SelectItem[] = [];
  sortKey!: string;
  sortField!: string;
  sortOrder!: number;

  gameEditForm = this.formBuilder.group({
    rating: [0],
    addToFavourites: [false]
  })
  
  constructor(private messageService : MessageService, private formBuilder: FormBuilder, private confirmationService: ConfirmationService, private userBoardGameService: UserBoardGameService){}
  
  ngOnInit(): void {
    this.sortOptions = [
      { label: 'Name A -> Z', value: 'name' },
      { label: 'Name Z -> A', value: '!name' },
      { label: 'Overall Rating Low to High ', value: 'rating' },
      { label: 'Overall Rating High to Low', value: '!rating' },
      { label: 'User Rating Low to High ', value: 'userRating' },
      { label: 'User Rating High to Low', value: '!userRating' }
    ];
  }
  
  onSortChange(event: any) {
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
  
  triggerCallback(): void {
    if (this.toggleButtonFn && this.userId) {
      this.toggleButtonFn(this.userId);
    }
  }
 
  closeEditForm(){
    this.selectedGameId = null;
    this.openUserGameForm = false;
  }

  showEditUserGameForm(game: UserBoardGame){
    this.selectedGameId = game.boardGameId;
    this.isFavActive = game.isFavourite
    this.gameEditForm.controls['rating'].setValue(game.userRating),
    this.gameEditForm.controls['addToFavourites'].setValue(game.isFavourite)
    this.openUserGameForm = true;
  }

  onFavClick(){
    this.isFavActive = !this.isFavActive;
    this.gameEditForm.get('addToFavourites')?.setValue(this.isFavActive)
  }

  toggleFavourite(gameId: number){
    console.error(gameId)
    this.confirmationService.confirm({
      message: "Are you sure you want to remove game from your favourite list?",
      header: "Confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {

        this.userBoardGameService.changeBoardGameFavStatus(gameId).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Game edited.'})
            this.changeInDataEvent.emit(true);
          },

          error: (e) => {
            console.error('Error while remove game from favourite list', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while remove game from favourite list.'});
          }
        })
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Remove game from favourite list canceled.' });
        this.confirmationService.close();
      }
    })
  }
  
  editUserGameDetails(gameId: number){
    console.error(this.gameEditForm.get('rating')?.value)
    this.confirmationService.confirm({
      message: "Are you sure you want to edit game on your list?",
      header: "Confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {

        const editUserGameData = {
          rating: this.gameEditForm.get('rating')?.value, 
          isFavourite: this.gameEditForm.get('addToFavourites')?.value
        } as EditUserGameDetails;

        this.userBoardGameService.editUserGameDetails(gameId, editUserGameData).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Game edited.'})
            this.openUserGameForm = false;
            this.changeInDataEvent.emit(true);
          },

          error: (e) => {
            console.error('Error while editing game in list', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while editing game in list.'});
          }
        })
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Edit game in list canceled.' });
        this.confirmationService.close();
      }
    })
  }

  deleteGameFromList(gameId : number) : void {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete game from your list?",
      header: "Delete confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        this.userBoardGameService.deleteGameFromUserList(gameId).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Game deleted from the list!' });
            this.rateValue = 0;
            this.changeInDataEvent.emit(true);
          },

          error: (e) => {
            console.error('Error while deleting game', e);
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error while deleting game.'});
          }
        })   
        this.confirmationService.close();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete game from list canceled.' });
        this.confirmationService.close();
      }
    })
  }
}
