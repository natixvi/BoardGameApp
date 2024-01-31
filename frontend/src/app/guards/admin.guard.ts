import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard:  CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService.isLoggedIn$.pipe(
    switchMap((isLoggedIn) => {
      if (!isLoggedIn){
        return router.navigate(['login']).then(() => false);
      }
      else if(authService.getParsedToken().role === 'Admin'){
        return of(true);
      }
      return router.navigate(['forbidden']).then(() => false);
    })
  );
};
