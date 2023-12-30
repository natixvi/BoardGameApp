import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterModule, CommonModule, MenubarModule],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  // isNavbarCollapsed = true;
  items: MenuItem[] | undefined;
  router = inject(Router);
  isLoggedIn$: Observable<boolean> | undefined;

  constructor(public authService: AuthService){}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.items = [
        
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: ['/home'],
        },
        {
          label: 'Games',
          icon: 'pi pi-list',
          routerLink: ['/games'],
        },
        {
          label: 'Account',
          icon: 'pi pi-user',
          visible: isLoggedIn,
          items: [
            { label: 'Profile', icon: 'pi pi-user', routerLink: ['/notfound'] },
            { label: 'Edit Profile', icon: 'pi pi-pencil', routerLink: ['/editAccount'] },
            { label: 'Game List', icon: 'pi pi-list', routerLink: ['/notfound'] },
            { separator: true, visible: isLoggedIn },
            { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
          ],
        },
        { label: 'Login', icon: 'pi pi-sign-in', visible: !isLoggedIn, routerLink: ['/login'] },
        { label: 'Register', icon: 'pi pi-user-plus', visible: !isLoggedIn,routerLink: ['/register'] },
      ];
    });
  }
  
  logout(){
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
