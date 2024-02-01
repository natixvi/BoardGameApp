import { Injectable, inject } from '@angular/core';
import { environment } from '../config';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { ResourceNotFoundError } from '../exceptions/ResourceNotFoundError';
import { GeneralError } from '../exceptions/GeneralError';
import { UserOnOtherProfile } from '../models/favUser/userOnOtherProfile';

@Injectable({
  providedIn: 'root'
})
export class FavUserService {
  private apiUrl = environment.apiUrl;
  router = inject(Router);
  
  constructor(private http: HttpClient,) { }

  isUserInFavUserList(favUserId: number): Observable<boolean>{
    return this.http.get<boolean>(`${this.apiUrl}/favouriteuser/is-user-in-list/${favUserId}`).pipe(
      catchError(error => {
        console.log('Error loading user on fav user list' , error);
        return this.handleError(error);
      })
    );
  }

  addUserToFavUserList(favUserId: number) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/favouriteuser/add/${favUserId}`, {}).pipe(
      catchError(error => {
        console.log('Error while adding user to fav user list' , error);
        return this.handleError(error);
      })
    );
  }

  getUsersWhoAddedSelectUserToFriends(userId: number) : Observable<UserOnOtherProfile[]>{
    return this.http.get<UserOnOtherProfile[]>(`${this.apiUrl}/favouriteuser/${userId}/user-on-other-profiles`).pipe(
      catchError(error => {
        console.log('Error while get user profile who add user to fav user list' , error);
        return this.handleError(error);
      })
    );
  }
  deleteUserFromFavUserList(favUserId: number): Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/favouriteuser/delete/${favUserId}`).pipe(
      catchError(error => {
        console.log('Error while deleting user from fav user list' , error);
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
      this.router.navigate(['notfound']);
      return throwError(() => new ResourceNotFoundError(error.error));
    }
    else {
      return throwError(() => new GeneralError(error.error));
    }
  }
}
