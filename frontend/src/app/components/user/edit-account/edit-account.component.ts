import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { checkPasswordsValidator } from '../../validators/checkPasswords.validator';

@Component({
  selector: 'app-edit-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, RouterModule],
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent {

  editProfileForm = this.formBuilder.group({
    nickName: [''],
    email: ['', Validators.email]
  }, {updateOn: 'submit'})

  changePassForm = this.formBuilder.group({
    oldPassword: [''],
    password: ['', Validators.required, Validators.minLength(8)],
    confirmPassword:  ['', Validators.required, Validators.minLength(8)]
  }, {validators: checkPasswordsValidator, updateOn: 'submit'}  as AbstractControlOptions )

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private messageService: MessageService){}
}
