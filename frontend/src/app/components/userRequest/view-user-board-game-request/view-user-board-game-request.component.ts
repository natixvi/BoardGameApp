import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
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

@Component({
  selector: 'app-view-user-board-game-request',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TableModule, ButtonModule, RouterModule, TagModule, InputTextModule, TooltipModule, DialogModule],
  templateUrl: './view-user-board-game-request.component.html',
  styleUrls: ['./view-user-board-game-request.component.css']
})
export class ViewUserBoardGameRequestComponent {

  userBoardGameRequests: BoardGameRequest[] = [];
  selectedRequest: BoardGameRequest = { } as BoardGameRequest;
  showDialog: boolean = false;
  router = inject(Router);
  
  constructor(private boardGameRequestService: BoardGameRequestService, private messageService: MessageService){}

  ngOnInit(): void {
    this.getUsersRequest();
  }

  getUsersRequest(){
    this.boardGameRequestService.getUserBoardGameRequests().subscribe({
      next: (data : BoardGameRequest[]) =>{
        this.userBoardGameRequests = data;
        this.userBoardGameRequests.forEach((request: BoardGameRequest) => {
          request.createdTime = new Date(request.createdTime);            
        });
        this.userBoardGameRequests?.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof UnauthorizedError){
          this.router.navigate(['login'])
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if (e instanceof ForbiddenError){
          this.router.navigate(['forbidden'])
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error! "})
      }
    })
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

  showRequestDetail(request: BoardGameRequest){
    this.selectedRequest = request;
    this.showDialog = true;
  }
  hideDialog(){
    this.showDialog = false;
    this.selectedRequest = { } as BoardGameRequest;
  }
  
}
