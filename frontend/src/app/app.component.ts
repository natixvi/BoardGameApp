import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet,  RouterLink, RouterLinkActive],
  providers: [MessageService, DatePipe]

})
export class AppComponent {
  constructor(public authService: AuthService) {}
  title = 'frontend';
}
