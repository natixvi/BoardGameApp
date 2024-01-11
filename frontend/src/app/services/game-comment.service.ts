import { Injectable } from '@angular/core';
import { environment } from '../config';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AddGameComment } from '../models/comment/addGameComment';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { NotFoundError } from '../exceptions/NotFoundError';
import { GeneralError } from '../exceptions/GeneralError';
import { DuplicatedDataError } from '../exceptions/DuplicatedDataError';
import { EditUserGameComment } from '../models/comment/editUserGameComment';

@Injectable({
  providedIn: 'root'
})
export class GameCommentService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  addGameComment(gameId: number, addGameComment : AddGameComment) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/boardgamecomment/${gameId}/add-comment`, addGameComment).pipe(
      catchError(error => {
        console.log('Error while adding game comment:' , error);
        return this.handleError(error);
      })
    );
 }

 editGameComment(commentId: number, editUserGameComment: EditUserGameComment): Observable<string>{
  return this.http.put(`${this.apiUrl}/boardgamecomment/edit/${commentId}`, editUserGameComment, {responseType: 'text'}).pipe(
    catchError(error => {
      console.log('Error while editing game comment:' , error);
      return this.handleError(error);
    })
  );
 }

 deleteUserGameComment(commentId: number) : Observable<any>{
  return this.http.delete<any>(`${this.apiUrl}/boardgamecomment/delete/${commentId}`).pipe(
    catchError(error => {
      console.log('Error while deleting game comment:' , error);
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
