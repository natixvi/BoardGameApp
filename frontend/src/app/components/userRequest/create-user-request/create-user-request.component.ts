import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserRequestService } from '../../../services/user-request.service';

@Component({
  selector: 'app-create-user-request',
  standalone: true,
  imports: [],
  templateUrl: './create-user-request.component.html',
  styleUrls: ['./create-user-request.component.css']
})
export class CreateUserRequestComponent {

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
    const requestData ={
      messageTitle: this.userRequestForm.get('messageTitle')?.value,
      messageBody: this.userRequestForm.get('messageBody')?.value,
      createdTime: 
    }

  }
}
