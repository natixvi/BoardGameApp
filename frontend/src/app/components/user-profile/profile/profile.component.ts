import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UserBoardGameService } from '../../../services/user-board-game.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  userId : number = 0;
  isLoggedIn$: Observable<boolean> | undefined;
  isLoggedIn: boolean = false;
  isCurrentUserList: boolean = false;
  currentUserId: number = 0;

  constructor(private route: ActivatedRoute, private userBoardGameService: UserBoardGameService, private authService: AuthService){}
  
}
