import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { MessageService } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { UserRegisterData } from '../../models/user/userRegisterData';
import { checkPasswordsValidator } from '../validators/checkPasswords.validator';
import { UserLoginData } from '../../models/user/userLoginData';
import { BadRequestError } from '../../exceptions/BadRequestError';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, RouterModule, PasswordModule, InputTextModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

})
export class RegisterComponent {
  registerForm=this.formBuilder.group({
    nickName: ['', [Validators.required, Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  },{validators: checkPasswordsValidator, updateOn: 'submit'}  as AbstractControlOptions)

  router: Router = inject(Router);
  value: string | undefined;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private messageService: MessageService){}

  fieldTextType: boolean | undefined;
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  registerUser() {
    if (this.registerForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect register data!'});
      return;
    }
    const registerData = {
      nickName: this.registerForm.get('nickName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      confirmPassword: this.registerForm.get('confirmPassword')?.value
      
    } as UserRegisterData;

    this.userService.register(registerData).subscribe(
      {
      next: () => {
        const loginData = {
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value
        } as UserLoginData

        this.userService.login(loginData).subscribe(
          {
            next: () => {
              this.router.navigate(['home']);
            }
          }
        );

      },
      error: (e) =>{
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error !', detail: "This email address or nickname is already taken!"});
          this.registerForm.get('password')?.reset();
          this.registerForm.get('confirmPassword')?.reset();
          this.registerForm.setErrors({ generalError: true });
        }
        else
        {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error'})
        }
      }
      
    });
  }
}
