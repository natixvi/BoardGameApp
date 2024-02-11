import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserRequestService } from '../../../services/user-request.service';
import { CreateUserRequest } from '../../../models/userRequest/createUserRequest';
import { UnauthorizedError } from '../../../exceptions/UnauthorizedError';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-create-user-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextareaModule, ButtonModule, InputTextModule],
  templateUrl: './create-user-request.component.html',
  styleUrls: ['./create-user-request.component.css']
})
export class CreateUserRequestComponent {

  router = inject(Router);
  
  userRequestForm = this.formBuilder.group({
    messageTitle: ['', [Validators.required, Validators.maxLength(100)]],
    messageBody: ['', Validators.required]
  })
  
  constructor(private formBuilder: FormBuilder, private userRequestService: UserRequestService, private messageService: MessageService){}


  sendRequest(){
    if(this.userRequestForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect data!'});
      return;
    }
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 1);
    const isoDateString = currentDate.toISOString();

    const requestData ={
      messageTitle: this.userRequestForm.get('messageTitle')?.value,
      messageBody: this.userRequestForm.get('messageBody')?.value,
      createdTime: isoDateString
    } as CreateUserRequest

    this.userRequestService.createUserRequest(requestData).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Message has been sent.'})
        this.router.navigate(['/messages']);
      },
      error: (e) =>{
        if (e instanceof UnauthorizedError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          this.router.navigate(['login']);
        } else if (e instanceof BadRequestError) {
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"});
        }
      }
    })

  }
}
