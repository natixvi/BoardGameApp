import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
    console.log("jwt interceptor constructor")
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Inside JwtInterceptor intercept");
    const token = this.authService.getToken()
    console.log(token)
    const currentDate = new Date() ;
    if (token) {
      const expirationDate = new Date(this.authService.getParsedToken().exp * 1000);
      if (expirationDate > currentDate ) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      } 
      else {
        console.log("inside inter logout")
        this.authService.logout();
      }
    }
    return next.handle(request)
  }
}
