import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  userInfo: any;
  constructor(public authService: AuthService, public userService: UserService){}
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;

  router = inject(Router);

  ngOnInit(): void {
    
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });   
  }

}
