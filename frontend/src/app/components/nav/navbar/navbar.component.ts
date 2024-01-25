import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmationService, MenuItem } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterModule, CommonModule, MenubarModule],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  router = inject(Router);
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  loggedInUserId: number = 0;

  constructor(public authService: AuthService, private confirmationService: ConfirmationService){}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      let isAdmin;  
      if(this.isLoggedIn){
          this.loggedInUserId = this.authService.getParsedToken().Id.toString();
          let userRole = this.authService.getParsedToken().role.toString();
          isAdmin = userRole === "Admin"
      }
      this.items = [
        {
          label: 'Home',
          icon: 'pi pi-home',
          routerLink: ['home'],
        },
        {
          label: 'Games',
          icon: 'pi pi-list',
          items: 
          [
            {label: 'Games', routerLink: ['games']},
            {label: 'Top 10', routerLink: ['topGames']}
          ],
        },
        { 
          label: 'Admin Panel', 
          icon: 'pi pi-user-edit', 
          visible: isAdmin === true,
          items: [
            { label: 'Users', icon: 'pi pi-users'},
            { label: 'User requests', icon: 'pi pi-inbox'},
            { label: 'Board game panel', icon: 'pi pi-cog', routerLink: ['boardGameSettings',]} 
          ]
        },
        {
          label: 'Account',
          icon: 'pi pi-user',
          visible: isLoggedIn,
          items: [
            { label: 'Profile', icon: 'pi pi-user', routerLink: ['userProfile', this.loggedInUserId]},
            { label: 'Game list', icon: 'pi pi-list',  routerLink: ['userGameList/', this.loggedInUserId]},
            { label: 'Edit profile', icon: 'pi pi-cog', routerLink: ['editAccount'] },       
            { separator: true, visible: isLoggedIn },
            { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
          ],
        },
        { label: 'Login', icon: 'pi pi-sign-in', visible: !isLoggedIn, routerLink: ['login'] },
        { label: 'Register', icon: 'pi pi-user-plus', visible: !isLoggedIn,routerLink: ['register'] },
      ];
    });
  }
  
  logout(){
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      header: 'Logout',
      accept: () => {
        this.authService.logout();
        this.confirmationService.close();
      },
      reject: () => {
        this.confirmationService.close();
      }
    })
  }

}

