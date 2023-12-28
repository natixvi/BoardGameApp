import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UnauthorizedError } from '../../exceptions/UnauthorizedError';
import { UserLoginData } from '../../models/user/userLoginData';
import { UserService } from '../../services/user.service';
import { BadRequestError } from '../../exceptions/BadRequestError';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, RouterModule, InputTextModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
})
export class LoginComponent {

  loginForm = this.formBuilder.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', Validators.required]
  }, {updateOn: 'submit'})

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService, private messageService: MessageService){}
 
  loginUser() {
    if (this.loginForm.invalid){
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Incorrect login data!'});
      return;
    }
    this.userService.login(this.loginForm.value as UserLoginData).subscribe({
      next: () => {
        this.router.navigate(['home']);
      },
      error: (e) =>{
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          this.loginForm.reset();
        }
        else if (e instanceof UnauthorizedError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          this.loginForm.reset();
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error.'});
      }
    
    });
  }
}
