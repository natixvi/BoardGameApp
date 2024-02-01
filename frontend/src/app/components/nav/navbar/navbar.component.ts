import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterModule, CommonModule, MenubarModule, ButtonModule],
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
          label: 'Board games',
          icon: 'pi pi-list',
          routerLink: ['games'],
          items: 
          [
            {label: 'All games', routerLink: ['games']},
            {label: 'Top 10 games', routerLink: ['topGames']}
          ],
        },
        {
          label: 'My boardgame lists', 
          icon: 'pi pi-book',  
          visible: isLoggedIn,
          routerLink: ['userGameList/', this.loggedInUserId]
        },
        {
          label: 'Messages', 
          icon: 'pi pi-envelope',  
          visible: isLoggedIn && isAdmin === false,
          items: [
            { label: 'Sended requests', icon: 'pi pi-envelope'},
            { label: 'Send us a request', icon: 'pi pi-send'},       
          ],
        }, 
        { 
          label: 'Admin', 
          icon: 'pi pi-user-edit', 
          visible: isAdmin === true,
          items: [
            { label: 'User requests', icon: 'pi pi-inbox', routerLink: ['userRequests',]},
            { label: 'Board games', icon: 'pi pi-cog', routerLink: ['boardGameSettings']} 
          ]
        },
        {
          label: 'Account',
          icon: 'pi pi-user',
          visible: isLoggedIn,
          items: [
            { label: 'Profile', icon: 'pi pi-user', routerLink: ['userProfile', this.loggedInUserId]},
            { label: 'Edit profile', icon: 'pi pi-cog', routerLink: ['editAccount'] },       
            { separator: true, visible: isLoggedIn },
            { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() },
          ],
        },     
        { label: 'Login', icon: 'pi pi-sign-in', visible: !isLoggedIn, routerLink: ['login'] },
        { label: 'Register',icon: 'pi pi-user-plus', visible: !isLoggedIn,routerLink: ['register']},
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

