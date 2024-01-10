import { Injectable } from '@angular/core';
import { environment } from '../config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AddGameReview } from '../models/review/addGameReview';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { GeneralError } from '../exceptions/GeneralError';
import { EditUserGameReview } from '../models/review/editUserGameReview';
import { DuplicatedDataError } from '../exceptions/DuplicatedDataError';

@Injectable({
  providedIn: 'root'
})
export class GameReviewService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  addGameReview(gameId: number, addGameReview : AddGameReview) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/boardgamereview/${gameId}/add-review`, addGameReview).pipe(
      catchError(error => {
        console.log('Error while adding game review:' , error);
        return this.handleError(error);
      })
    );
 }

 editGameReview(reviewId: number, editUserGameReview: EditUserGameReview): Observable<string>{
  return this.http.put(`${this.apiUrl}/boardgamereview/edit/${reviewId}`, editUserGameReview, {responseType: 'text'}).pipe(
    catchError(error => {
      console.log('Error while editing game review:' , error);
      return this.handleError(error);
    })
  );
 }

 deleteUserGameReview(reviewId: number) : Observable<any>{
  return this.http.delete<any>(`${this.apiUrl}/boardgamereview/delete/${reviewId}`).pipe(
    catchError(error => {
      console.log('Error while deleting game review:' , error);
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
  } else if (error.status === 409){
    return throwError(() => new DuplicatedDataError(error.error));
  }
  else {
    return throwError(() => new GeneralError(error.error));
  }
}

}
