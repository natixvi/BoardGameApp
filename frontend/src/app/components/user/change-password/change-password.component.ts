import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { checkPasswordsValidator } from '../../validators/checkPasswords.validator';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { ChangeUserPasswordData } from '../../../models/user/changeUserPasswordData';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, RouterModule, PasswordModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  changePassForm = this.formBuilder.group({
    oldPassword: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword:  ['', [Validators.required, Validators.minLength(8)]]
  },{validators: checkPasswordsValidator, updateOn: 'submit'}  as AbstractControlOptions)

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private messageService: MessageService){}
  
  changePassword(){
    if (this.changePassForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect data!'});
      return;
    }
    const changePasswordData = {
      oldPassword: this.changePassForm.get('oldPassword')?.value,
      password: this.changePassForm.get('password')?.value,
      confirmPassword: this.changePassForm.get('confirmPassword')?.value
    } as ChangeUserPasswordData

    this.userService.changeUserPassword(changePasswordData).subscribe({
      next: () =>{
        this.messageService.add({severity: 'success', summary: "Success", detail: "User password has been changed."})
        this.changePassForm.reset();
      },
      error: (e) => {
        console.error(e);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'User changing password failed.' });
      }
    });
   
  }
  
}
