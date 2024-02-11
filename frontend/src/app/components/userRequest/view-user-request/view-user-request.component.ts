import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToolbarModule } from 'primeng/toolbar';
import { UserRequest } from '../../../models/userRequest/userRequest';
import { UserRequestService } from '../../../services/user-request.service';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { MessageService } from 'primeng/api';
import { UnauthorizedError } from '../../../exceptions/UnauthorizedError';
import { ForbiddenError } from '../../../exceptions/ForbiddenError';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-view-user-request',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TableModule, ButtonModule, RouterModule, TagModule, InputTextModule, TooltipModule, DialogModule],
  templateUrl: './view-user-request.component.html',
  styleUrls: ['./view-user-request.component.css']
})
export class ViewUserRequestComponent implements OnInit{

  usersRequests: UserRequest[] = [];
  selectedRequest: UserRequest = { } as UserRequest;
  showDialog: boolean = false;
  router = inject(Router);
  
  constructor(private userRequestService: UserRequestService, private messageService: MessageService){}

  ngOnInit(): void {
    this.getUsersRequest();
  }

  getUsersRequest(){
    this.userRequestService.getUserRequests().subscribe({
      next: (data : UserRequest[]) =>{
        this.usersRequests = data;
        this.usersRequests.forEach((request: UserRequest) => {
          request.createdTime = new Date(request.createdTime);            
        });
        this.usersRequests?.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());
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

  showRequestDetail(request: UserRequest){
    this.selectedRequest = request;
    this.showDialog = true;
  }
  hideDialog(){
    this.showDialog = false;
    this.selectedRequest = { } as UserRequest;
  }
  
}
