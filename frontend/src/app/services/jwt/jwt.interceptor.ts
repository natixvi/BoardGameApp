import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    const currentDate = new Date();
    if(token){
      const expirationDate = new Date(this.authService.getParsedToken().exp* 1000);
      if(expirationDate > currentDate){
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        })
      }
      else{
        this.authService.logout();
      }
    }
    return next.handle(request);
  }
}