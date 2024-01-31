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
import { UserRequest } from '../models/userRequest/userRequest';
import { ForbiddenError } from '../exceptions/ForbiddenError';

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  private apiUrl = environment.apiUrl;
  router = inject(Router);
  
  constructor(private http: HttpClient) { }

  createUserRequest(userRequest: CreateUserRequest) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/userrequest/create`, userRequest).pipe(
      catchError(error => {
        console.log('Error while adding user request:' , error);
        return this.handleError(error);
      })
    );
  }

  getAllRequests() : Observable<UserRequest[]>{
    return this.http.get<UserRequest[]>(`${this.apiUrl}/userrequest`).pipe(
      catchError(error => {
        console.log('Error while get users requests:' , error);
        return this.handleError(error);
      })
    );
  }

  changeRequestStatus(requestId: number, state: ChangeRequestStatus) : Observable<string>{
    return this.http.put(`${this.apiUrl}/userrequest/${requestId}/change-status`, state, {responseType: 'text'} ).pipe(
      catchError(error => {
        console.log('Error while changing request status:' , error);
        return this.handleError(error);
      })
    );
  }

  getUserRequests() : Observable<UserRequest[]>{
    return this.http.get<UserRequest[]>(`${this.apiUrl}/userrequest/user/messages`).pipe(
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
    } else if (error.status === 403){
      this.router.navigate(['forbidden'])
      return throwError(() => new ForbiddenError(error.error));
    } 
    else {
      return throwError(() => new GeneralError(error.error));
    }
  }

}