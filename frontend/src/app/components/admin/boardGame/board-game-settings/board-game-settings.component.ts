import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
  selector: 'app-board-game-settings',
  standalone: true,
  imports: [SelectButtonModule, FormsModule],
  templateUrl: './board-game-settings.component.html',
  styleUrls: ['./board-game-settings.component.css']
})
export class BoardGameSettingsComponent {
  // value: any;

  // editOptions: any[] = [
  //   {name: 'Add Board Game', value: 1},
  //   {name: 'Edit Board Game', value: 2},
  //   {name: 'Delete Board Game', value: 3}
  // ]
}
