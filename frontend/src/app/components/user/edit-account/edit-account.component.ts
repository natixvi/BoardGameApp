import { CommonModule } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditDataComponent } from "../edit-data/edit-data.component";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { DeleteAccountComponent } from "../delete-account/delete-account.component";
import { FormsModule} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-edit-account',
    standalone: true,
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.css'],
    imports: [CommonModule, RouterModule, DropdownModule, ButtonModule, InputTextModule, EditDataComponent, ChangePasswordComponent, DeleteAccountComponent, FormsModule]
})

export class EditAccountComponent{

}
