import { Injectable } from '@angular/core';
import { environment } from '../config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { GeneralError } from '../exceptions/GeneralError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { AddGameToList } from '../models/game/addGameToList';
import { UserGameDetails } from '../models/userGame/UserGameDetails';
import { EditUserGameDetails } from '../models/userGame/editUserGameDetails';

@Injectable({
  providedIn: 'root'
})
export class UserBoardGameService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,) { }

  isGameInUserList(gameId: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.apiUrl}/userboardgame/is-game-in-list/${gameId}`).pipe(
      catchError(error => {
        console.log('Error loading status game on user list' , error);
        return this.handleError(error);
      })
    );
  }

  addGameToUserList(gameId: number | null, addedGame: AddGameToList) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/userboardgame/add/${gameId}`, addedGame).pipe(
      catchError(error => {
        console.log('Error while adding game to user list' , error);
        return this.handleError(error);
      })
    );
  }

  getUserGameDetails(gameId: number) : Observable<UserGameDetails>{
    return this.http.get<UserGameDetails>(`${this.apiUrl}/userboardgame/details/${gameId}`).pipe(
      catchError(error => {
        console.log('Error while get game details from user list' , error);
        return this.handleError(error);
      })
    );
  }

  editUserGameDetails(gameId: number, editUserGameDetails: EditUserGameDetails) : Observable<string>{
    return this.http.put(`${this.apiUrl}/userboardgame/edit/${gameId}`, editUserGameDetails, {responseType: 'text'}).pipe(
      catchError(error => {
        console.log('Error while edit user game details' , error);
        return this.handleError(error);
      })
    );
  }

  deleteGameFromUserList(gameId: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/userboardgame/delete/${gameId}`).pipe(
      catchError(error => {
        console.log('Error while deleting game from user list' , error);
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
      return throwError(() => new NotFoundError(error.error));
    }
    else {
      return throwError(() => new GeneralError(error.error));
    }
  }
}
