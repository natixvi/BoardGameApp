import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http'
import { environment } from '../config';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { GeneralError } from '../exceptions/GeneralError';
import { AuthService } from './auth.service';
import { UserLoginData } from '../models/user/userLoginData';
import { UserRegisterData } from '../models/user/userRegisterData';
import { EditUserData } from '../models/user/editUserData';
import { NotFoundError } from '../exceptions/NotFoundError';
import { ChangeUserPasswordData } from '../models/user/changeUserPasswordData';
import { UserInfo } from '../models/user/userInfo';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {  console.log('userservice created!');}

  login(credentials: UserLoginData){
    return this.http.post<any>(`${this.apiUrl}/Account/login`, credentials).pipe(
      tap((response) => { 
        this.authService.login(response.token);
      }),
      catchError(error => {
        console.log('Błąd podczas logowania:' , error);
        console.log(error.status);
        console.log(error.error);
        return this.handleError(error);
      })
    );;
  }

  register(registerData: UserRegisterData){
    return this.http.post<any>(`${this.apiUrl}/Account/register`, registerData).pipe(
      tap((response) => { 
        console.log(response)
      }),
      catchError( error => {
        return this.handleError(error);
      })
      );
  }

  getUserInfo(){
    return this.http.get<UserInfo>(`${this.apiUrl}/Account/user-data`).pipe(catchError(error => {
      return this.handleError(error);}))
  }

  editUserData(editUserData: EditUserData){
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

  changeUserPassword(changeUserPasswordData: ChangeUserPasswordData){
    return this.http.put<any>(`${this.apiUrl}/Account/change-password`, changeUserPasswordData).pipe(
      tap((response) => {
        console.log(response)
      }),
      catchError( error => {
        return this.handleError(error)
      })
    )
  }
  deleteAccount(){
    return this.http.delete<any>(`${this.apiUrl}/Account/delete`).pipe(
      tap((response) => {
        console.log(response)
      }),
      catchError( error => {
        return this.handleError(error)
      })
    )
  }
  getRoles(): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/Account/roles`);
  }

  private handleError(error: HttpErrorResponse): Observable<any>{
    if (error.status === 401) {
      return throwError(() => new UnauthorizedError(error.error));
    } else if (error.status === 400) {
      return throwError(() => new BadRequestError(error.error));
    } else if(error.status === 404){
      return throwError(() => new NotFoundError(error.error));
    } else {
      return throwError(() => new GeneralError(error.error));
    }
  }
}
