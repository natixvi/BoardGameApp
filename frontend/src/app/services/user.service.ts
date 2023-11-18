import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'
import { environment } from '../config';
import { userLoginData } from '../models/UserLoginDto';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { BadRequestError } from '../exceptions/BadRequestError';
import { GeneralError } from '../exceptions/GeneralError';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }

  login(credentials: userLoginData){
    return this.http.post(`${this.apiUrl}/Account/login`, credentials).pipe(
      tap((response) => { 
        console.log(response)
        //this.authService.login(response);
      }),
      catchError(error => this.handleError(error))
    );;
  }

  private handleError(error: HttpErrorResponse): Observable<any>{
    if (error.status === 401) {
      return of(new UnauthorizedError('Unauthorized'));
    } else if (error.status === 400) {
      return of(new BadRequestError('Invalid email or password'));
    } else {
      return of(new GeneralError('An error occurred'));
    }

    
      // if (error.status === 401){
    //   return throwError(() => new UnauthorizedError('Unauthorized'));
    // }
    // else if (error.status === 400){
    //   return throwError(() => new BadRequestError('Invalid email or password'));
    // }
  }
}
