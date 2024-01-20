import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NavbarComponent } from './components/nav/navbar/navbar.component';
import { registerLocaleData } from '@angular/common';

import localePl from '@angular/common/locales/pl';
registerLocaleData(localePl);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, RouterLink, RouterLinkActive, ToastModule, ConfirmDialogModule, NavbarComponent],
  providers: [MessageService, DatePipe, ConfirmationService, { provide: LOCALE_ID, useValue: 'pl-PL' } ]

})
export class AppComponent {
  title = 'frontend';
}
