import { Injectable } from '@angular/core';
import { environment } from '../config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { GeneralError } from '../exceptions/GeneralError';
import { NotFoundError } from '../exceptions/NotFoundError';

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

  deleteGameFromUserList(gameId: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/userboardgame/delete/${gameId}`).pipe(
      catchError(error => {
        console.log('Error deleting game from user list' , error);
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
