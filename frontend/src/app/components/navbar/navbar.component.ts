import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterModule, CommonModule, NgbModule],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  isNavbarCollapsed = true;
  router = inject(Router);
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(public authService: AuthService){}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
