import { Component, OnInit} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder){}


  ngOnInit() {}
  loginUser() {
    //this.authService.login();
  }
}
