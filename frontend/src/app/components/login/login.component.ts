import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UnauthorizedError } from 'src/app/exceptions/UnauthorizedError';
import { userLoginData } from 'src/app/models/userLoginData';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
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
    this.userService.login(this.loginForm.value as userLoginData).subscribe({
      next: () => {
        this.router.navigate(['home']);
      },
      error: (e) =>{
        if(e instanceof UnauthorizedError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Server connection error'})
        }
      }
    
    });
  }
}
