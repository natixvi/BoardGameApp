import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameDetails } from '../../../models/game/gameDetail';
import { GameService } from '../../../services/game.service';
import { MessageService } from 'primeng/api';
import { BadRequestError } from '../../../exceptions/BadRequestError';
import { CommonModule,  DatePipe } from '@angular/common';
import { Review } from '../../../models/game/review';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})
export class GameDetailComponent implements OnInit {
  gameId: number = 0;
  router = inject(Router);
  gameDetails: GameDetails | undefined


  constructor(private route: ActivatedRoute, private gameService: GameService, private messageService: MessageService, private datepipe: DatePipe){}

  ngOnInit() {
    this.route.params.subscribe({
      next: (params) =>{
        this.gameId = params['id'];
      }
    });
    this.getGameDetails();

  }
  
  getGameDetails(): void{
    this.gameService.getGameById(this.gameId).subscribe({
      next: (data: GameDetails) =>{
        this.gameDetails = data;
        this.gameDetails.reviews.forEach((review: Review) => {
          review.createdDate = new Date(review.createdDate);
        });
       
      },
      error: (e) => {
        if (e instanceof BadRequestError){
          this.messageService.add({severity: 'error', summary: 'Error', detail: e.message});
          //this.router.navigate(['notfound']);
        }
        else this.messageService.add({severity: 'error', summary: 'Error', detail: "Server connection Error!"})
      }
    })
  }


}
