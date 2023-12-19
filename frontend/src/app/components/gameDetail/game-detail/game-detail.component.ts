import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {
  gameId: number | undefined;
  router = inject(Router);

  constructor(private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) =>{
        this.gameId = params['id'];
      }
    })
  }
  


}
