import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { FavUserService } from '../../../services/fav-user.service';
import { UserOnOtherProfile } from '../../../models/favUser/userOnOtherProfile';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { MessageService } from 'primeng/api';
import { ResourceNotFoundError } from '../../../exceptions/ResourceNotFoundError';

@Component({
  selector: 'app-user-on-other-profiles',
  standalone: true,
  imports: [CommonModule, TableModule, RouterModule, ButtonModule, TooltipModule, ToolbarModule],
  templateUrl: './user-on-other-profiles.component.html',
  styleUrls: ['./user-on-other-profiles.component.css']
})
export class UserOnOtherProfilesComponent {
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  loggedInUserId: number = 0;
  userInfo: UserOnOtherProfile[] = [];
  router = inject(Router);

  constructor(private authService: AuthService,  private favUserService: FavUserService,private messageService : MessageService){}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
      if(this.isLoggedIn){
        this.loggedInUserId = Number(this.authService.getParsedToken().Id);
      }
    })
    this.getUsersWhoAddedSelectUserToFriends(this.loggedInUserId);
  }

  getUsersWhoAddedSelectUserToFriends(userId: number){
    this.favUserService.getUsersWhoAddedSelectUserToFriends(userId).subscribe({
      next: (data: UserOnOtherProfile[]) => {
        this.userInfo = data;
      },
      error: (e) =>{
        if (e instanceof BadRequestError){
          this.router.navigate(['notfound']);
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else if(e instanceof ResourceNotFoundError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
    })
  }

}
