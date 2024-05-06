import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http'
import { environment } from '../config';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { GeneralError } from '../exceptions/GeneralError';
import { AuthService } from './auth.service';
import { UserLoginData } from '../models/user/userLoginData';
import { UserRegisterData } from '../models/user/userRegisterData';
import { EditUserData } from '../models/user/editUserData';
import { ResourceNotFoundError } from '../exceptions/ResourceNotFoundError';
import { ChangeUserPasswordData } from '../models/user/changeUserPasswordData';
import { UserInfo } from '../models/user/userInfo';
import { DuplicatedDataError } from '../exceptions/DuplicatedDataError';
import { Router } from '@angular/router';
import { User } from '../models/user/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  router = inject(Router);
  
  constructor(private http: HttpClient, private authService: AuthService) {  console.log('userservice created!');}

  login(credentials: UserLoginData) : Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/Account/login`, credentials).pipe(
      tap((response) => { 
        this.authService.login(response.token);
      }),
      catchError(error => {
        console.log('Błąd podczas logowania:' , error);
        return this.handleError(error);
      })
    );;
  }

  register(registerData: UserRegisterData) : Observable<string>{
    return this.http.post(`${this.apiUrl}/Account/register`, registerData, { responseType: "text"}).pipe(
      catchError( error => {
        return this.handleError(error);
      })
      );
  }
  getUserById(userId: number) : Observable<UserInfo>{
    return this.http.get<UserInfo>(`${this.apiUrl}/Account/user/${userId}`).pipe(catchError(error => {
      return this.handleError(error);}))
  }
  getUserInfo() : Observable<User>{
    return this.http.get<User>(`${this.apiUrl}/Account/user-data`).pipe(catchError(error => {
      return this.handleError(error);}))
  }

  editUserData(editUserData: EditUserData) : Observable<any>{
    return this.http.put<any>(`${this.apiUrl}/Account/update-profile`, editUserData).pipe(
      tap((response) => {
        console.log(response)
        this.authService.login(response.token)
      }),
      catchError( error => {
        return this.handleError(error)
      })
    )
  }

  changeUserPassword(changeUserPasswordData: ChangeUserPasswordData) : Observable<string>{
    return this.http.put(`${this.apiUrl}/Account/change-password`, changeUserPasswordData, {responseType: 'text'}).pipe(
      catchError( error => {
        return this.handleError(error)
      })
    )
  }
  
  getRoles(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/Account/roles`);
  }

  deleteAccount() : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/Account/delete`).pipe(
      catchError( error => {
        return this.handleError(error)
      })
    )
  }

  private handleError(error: HttpErrorResponse): Observable<any>{
    if (error.status === 401) {
      this.router.navigate(['forbidden']);
      return throwError(() => new UnauthorizedError(error.error));
    } else if (error.status === 400) {
      return throwError(() => new BadRequestError(error.error));
    } else if(error.status === 404){
      this.router.navigate(['notfound']);
      return throwError(() => new ResourceNotFoundError(error.error));
    } else if (error.status == 409){
      return throwError( () => new DuplicatedDataError(error.error))
    }
    else {
      return throwError(() => new GeneralError(error.error));
    }
  }
}
