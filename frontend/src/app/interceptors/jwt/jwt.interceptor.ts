import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  console.log("working inter jwt")
  const authService = inject(AuthService);
  const token = authService.getToken()
  const currentDate = new Date();
  if (token) {
    console.log("working inter 2")
    const expirationDate = new Date(authService.getParsedToken().exp * 1000);
    if (expirationDate > currentDate) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      authService.logout();
    }
  }
  return next(req);
};

