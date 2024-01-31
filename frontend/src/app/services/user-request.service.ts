import { Injectable, inject } from '@angular/core';
import { environment } from '../config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ResourceNotFoundError } from '../exceptions/ResourceNotFoundError';
import { DuplicatedDataError } from '../exceptions/DuplicatedDataError';
import { GeneralError } from '../exceptions/GeneralError';
import { CreateUserRequest } from '../models/userRequest/createUserRequest';
import { ChangeRequestStatus } from '../models/userRequest/changeRequestStatus';

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createUserRequest(userRequest: CreateUserRequest) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/userrequest/create`, userRequest).pipe(
      catchError(error => {
        console.log('Error while adding user request:' , error);
        return this.handleError(error);
      })
    );
  }

  getAllRequests() : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/userrequest`).pipe(
      catchError(error => {
        console.log('Error while get users requests:' , error);
        return this.handleError(error);
      })
    );
  }

  changeRequestState(requestId: number, state: ChangeRequestStatus) : Observable<string>{
    return this.http.put(`${this.apiUrl}/userrequest/${requestId}/change-state`, state, {responseType: 'text'} ).pipe(
      catchError(error => {
        console.log('Error while changing request status:' , error);
        return this.handleError(error);
      })
    );
  }

  getUserRequests() : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/userrequest/user/messages`).pipe(
      catchError(error => {
        console.log('Error while get user requests:' , error);
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