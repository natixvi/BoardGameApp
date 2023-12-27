import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../services/user.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-delete-account',
  standalone:true,
  imports: [ButtonModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent {

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService, private userService: UserService){}

  deleteAccount(){
    this.confirmationService.confirm({
      message: "Are you sure you want to delete your account permamently?",
      header: "Delete confirmation",
      icon: 'pi pi-info-circle',
      accept: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account deleted!' });
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Account deletion canceled.' });
      }
    })
  }
}
