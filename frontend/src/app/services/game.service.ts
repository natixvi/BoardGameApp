import { Injectable } from '@angular/core';
import { environment } from '../config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Game } from '../models/game/game';
import { BadRequestError } from '../exceptions/BadRequestError';
import { GeneralError } from '../exceptions/GeneralError';
import { GameDetails } from '../models/game/gameDetail';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { ResourceNotFoundError } from '../exceptions/ResourceNotFoundError';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }


   getGames() : Observable<Game[]>{
      return this.http.get<Game[]>(`${this.apiUrl}/boardgame`).pipe(
        catchError(error => {
          console.log('Error while loading games:' , error);
          return this.handleError(error);
        })
      );
   }

   getGameById(gameId: number) : Observable<GameDetails>{
    return this.http.get<GameDetails>(`${this.apiUrl}/boardgame/${gameId}`).pipe(
      catchError(error => {
        console.log('Error while loading game:' , error);
        return this.handleError(error);
      })
    );
 }


   private handleError(error: HttpErrorResponse): Observable<any>{
    if (error.status === 401) {
      return throwError(() => new UnauthorizedError(error.error));
    } else if (error.status === 400) {
      return throwError(() => new BadRequestError(error.error));
    } else if (error.status === 404){
      return throwError(() => new ResourceNotFoundError(error.error));
    }
    else {
      return throwError(() => new GeneralError(error.error));
    }
  }

}
