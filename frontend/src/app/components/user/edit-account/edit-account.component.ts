import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EditDataComponent } from "../edit-data/edit-data.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { DeleteAccountComponent } from "../delete-account/delete-account.component";


@Component({
    selector: 'app-edit-account',
    standalone: true,
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.css'],
    imports: [CommonModule, ButtonModule, RouterModule, EditDataComponent, ChangePasswordComponent, DeleteAccountComponent]
})
export class EditAccountComponent{
  activeSection: 'edit-data' | 'change-password' | 'delete-account' = 'edit-data';
  
  showSection(section: 'edit-data' | 'change-password' | 'delete-account') {
    this.activeSection = section;
  }
}
