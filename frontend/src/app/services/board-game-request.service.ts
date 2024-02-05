import { Injectable, inject } from '@angular/core';
import { environment } from '../config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ResourceNotFoundError } from '../exceptions/ResourceNotFoundError';
import { ForbiddenError } from '../exceptions/ForbiddenError';
import { GeneralError } from '../exceptions/GeneralError';
import { CreateBoardGameRequest } from '../models/boardGameRequest/createBoardGameRequest';
import { BoardGameRequest } from '../models/boardGameRequest/boardGameRequest';
import { ChangeRequestStatus } from '../models/userRequest/changeRequestStatus';

@Injectable({
  providedIn: 'root'
})
export class BoardGameRequestService {

  private apiUrl = environment.apiUrl;
  router = inject(Router);
  
  constructor(private http: HttpClient) { }

  createBoardGameRequest(userBoardGameRequest: CreateBoardGameRequest) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/boardgamerequest/add`, userBoardGameRequest).pipe(
      catchError(error => {
        console.log('Error while adding user board game request:' , error);
        return this.handleError(error);
      })
    );
  }

  getAllBoardGameRequests() : Observable<BoardGameRequest[]>{
    return this.http.get<BoardGameRequest[]>(`${this.apiUrl}/boardgamerequest`).pipe(
      catchError(error => {
        console.log('Error while get users board game requests:' , error);
        return this.handleError(error);
      })
    );
  }

  changeBoardGameRequestStatus(requestId: number, state: ChangeRequestStatus) : Observable<string>{
    return this.http.put(`${this.apiUrl}/boardgamerequest/${requestId}/change-status`, state, {responseType: 'text'} ).pipe(
      catchError(error => {
        console.log('Error while changing board game request status:' , error);
        return this.handleError(error);
      })
    );
  }

  getUserBoardGameRequests() : Observable<BoardGameRequest[]>{
    return this.http.get<BoardGameRequest[]>(`${this.apiUrl}/boardgamerequest/user`).pipe(
      catchError(error => {
        console.log('Error while get user board game requests:' , error);
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
    } else if (error.status === 403){
      this.router.navigate(['forbidden'])
      return throwError(() => new ForbiddenError(error.error));
    } 
    else {
      return throwError(() => new GeneralError(error.error));
    }
  }
}
