import { Component, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-account',
  standalone:true,
  imports: [ButtonModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {
    router = inject(Router);

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private userService: UserService, private authService: AuthService){}

  deleteAccount(){
    this.confirmationService.confirm({
      message: "Are you sure you want to delete your account permamently?",
      header: "Delete confirmation",
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteAccount().subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['login']);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account deleted!' });
          },
          error: (e) => {
            console.error(e);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Server connection error' });
          }
        })
        
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Account deletion canceled.' });
      }
    })
  }
}
