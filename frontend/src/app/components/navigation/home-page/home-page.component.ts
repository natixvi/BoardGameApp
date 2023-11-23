import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  userInfo: any;
  constructor(public authService: AuthService, public userService: UserService){}
  currentDate!: Date;
  exp!: Date;
  isLoggedIn: boolean = false;
  roles: any;

  ngOnInit(): void {
    this.currentDate = new Date()
    this.currentDate.setDate(this.currentDate.getDate() + 2);
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.userInfo = this.authService.getParsedToken();
        console.log(this.authService.getParsedToken().exp)
        console.log(this.userInfo);
      }
    });
    this.exp = new Date(this.authService.getParsedToken().exp * 1000)
  }

  getRoles() {
    this.userService.getRoles().subscribe(
      (response) => {
        this.roles = response;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }


}
