import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-game-add-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule,RouterModule, InputTextModule],
  templateUrl: './game-add-form.component.html',
  styleUrls: ['./game-add-form.component.css']
})
export class GameAddFormComponent {

  gameAddForm = this.formBuilder.group({
    rating: [null, [Validators.required,  Validators.min(0), Validators.max(10)]],
    review: [''],
    addToFavourites: [false]
  })
  constructor(private formBuilder: FormBuilder, private router: Router, private messageService: MessageService){}

  onSubmit() : void {
    const formData = this.gameAddForm.value;
    console.log('Submitted Form Data:', formData);
  }
}
