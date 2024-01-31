import { Component, OnInit } from '@angular/core';
import { UserRequest } from '../../../models/userRequest/userRequest';
import { UserRequestService } from '../../../services/user-request.service';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { MessageService } from 'primeng/api';
import { UnauthorizedError } from '../../../exceptions/UnauthorizedError';
import { ForbiddenError } from '../../../exceptions/ForbiddenError';

@Component({
  selector: 'app-user-request',
  templateUrl: './user-request.component.html',
  styleUrls: ['./user-request.component.css']
})
export class UserRequestComponent implements OnInit{
  availableStatuses: string[] = ['Active', 'Discard', 'Done'];
  usersRequests: UserRequest[] = [];

  constructor(private userRequestService: UserRequestService, private messageService: MessageService){}

  ngOnInit(): void {
    
  }

  getUsersRequest(){
    this.userRequestService.getAllRequests().subscribe({
      next: (data : UserRequest[]) =>{
        this.usersRequests = data;
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
  
}
