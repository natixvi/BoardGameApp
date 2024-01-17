import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';
import { EditUserData } from '../../../models/user/editUserData';
import { InputTextModule } from 'primeng/inputtext';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { DuplicatedDataError } from '../../../exceptions/DuplicatedDataError';

@Component({
  selector: 'app-edit-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, RouterModule, InputTextModule],
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.css']
})
export class EditDataComponent implements OnInit {
  editProfileForm = this.formBuilder.group({
    nickName: ['', [Validators.required, Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.required]]
  }, {updateOn: 'submit'})

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private messageService: MessageService){}

  ngOnInit(): void {
    this.getUserInfo();
  }

  getUserInfo(){
    this.userService.getUserInfo().subscribe({
      next: (result) => {
        this.editProfileForm.controls['nickName'].setValue(result.nickName),
        this.editProfileForm.controls['email'].setValue(result.email)
      },
      error: (e) =>{
        if(e instanceof ResourceNotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else{
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error'})
        }
      }
    })
  }

  editProfile(){
    if (this.editProfileForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect data!'});
      return;
    }
    const editProfileData = {
      nickName: this.editProfileForm.get('nickName')?.value,
      email: this.editProfileForm.get('email')?.value
    } as EditUserData

    this.userService.editUserData(editProfileData).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: "Success", detail: "User data has been changed."})
      },
      error: (e) => {
        if (e instanceof DuplicatedDataError){
          this.messageService.add({severity: 'error', summary: 'Error !', detail: "This email address or nickname is already taken!"});
          this.editProfileForm.setErrors({ generalError: true });
          this.ngOnInit();
        }
        else{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server connection error' });
        }
        
      }

    })
  }
    
  
}

