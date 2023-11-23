import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { DuplicateUserDataError } from '../../../exceptions/DuplicateUserDataError';
import { UserRegisterData } from '../../../models/user/userRegisterData';
import { checkPasswordsValidator } from '../../validators/checkPasswordsValidator';
import { userLoginData } from '../../../models/user/userLoginData';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],

})
export class RegisterComponent {
  registerForm=this.formBuilder.group({
    nickName: ['', Validators.required],
    email: ['', [Validators.email,Validators.required]],
    passwords: this.formBuilder.group({
      password: ['', Validators.required, Validators.minLength(8)],
      confirmPassword: ['', Validators.required, Validators.minLength(8)]
    }, {Validators: checkPasswordsValidator}) 
  }, {updateOn: 'submit'})

  router: Router = inject(Router);

  constructor(private formBuilder: FormBuilder, private userService: UserService, private messageService: MessageService){}


  registerUser() {
    if (this.registerForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect register data!'});
      return;
    }

    const registerData = {
      nickName: this.registerForm.get('nickName')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('passwords')?.get('password')?.value,
      confirmPassword: this.registerForm.get('passwords')?.get('confirmPassword')?.value
      
    } as UserRegisterData;

    this.userService.register(registerData).subscribe(
      {
      next: () => {
        const loginData = {
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('passwords')?.get('password')?.value
        } as userLoginData

        this.userService.login(loginData).subscribe(
          {
            next: () => {
              this.router.navigate(['home']);
            }
          }
        );

      },
      error: (e) =>{
        if (e instanceof DuplicateUserDataError){
          this.messageService.add({severity: 'error', summary: 'Błąd', detail: 'Registration failed, the user already exists.'});
          this.registerForm.reset();
        }
        else
        {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error'})
        }
      }
    
    });
  }
}
