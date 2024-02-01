import { Component, OnInit } from '@angular/core';
import { UserRequest } from '../../../models/userRequest/userRequest';
import { UserRequestService } from '../../../services/user-request.service';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { MessageService } from 'primeng/api';
import { UnauthorizedError } from '../../../exceptions/UnauthorizedError';
import { ForbiddenError } from '../../../exceptions/ForbiddenError';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TagModule } from 'primeng/tag';
import { ChangeRequestStatus } from '../../../models/userRequest/changeRequestStatus';

@Component({
  selector: 'app-user-request',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TableModule, ButtonModule, InputTextModule, RouterModule, TooltipModule, DialogModule, FormsModule, RadioButtonModule, TagModule],
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.css']
})
export class UserRequestComponent implements OnInit{
  availableStatuses: string[] = ['Active', 'Discard', 'Done'];
  selectedStatus!: string;
  usersRequests: UserRequest[] = [];
  showDialog: boolean = false;
  selectedRequest: UserRequest = { } as UserRequest;

  constructor(private userRequestService: UserRequestService, private messageService: MessageService){}

  ngOnInit(): void {
    this.getUsersRequest();
  }

  getUsersRequest(){
    this.userRequestService.getAllRequests().subscribe({
      next: (data : UserRequest[]) =>{
        this.usersRequests = data;
        this.usersRequests.forEach((request: UserRequest) => {
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

  showRequestDetail(request: UserRequest){
    this.selectedRequest = request;
    this.selectedStatus = request.status;
    this.showDialog = true;
  }
  hideDialog(){
    this.showDialog = false;
    this.selectedRequest = { } as UserRequest;
    this.selectedStatus = "";
  }
  saveChanges(){
    this.showDialog = false;
    const newStatus = {
      status: this.selectedStatus
    } as ChangeRequestStatus; 

    this.userRequestService.changeRequestStatus(this.selectedRequest?.id, newStatus).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'User request status has been changed!' })
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
    this.selectedRequest = { } as UserRequest;
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