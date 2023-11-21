import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService.isLoggedIn$.pipe(
    switchMap((isLoggedIn) => {
      if (isLoggedIn){
        return router.navigate(['home']).then(() => false);
      }
      return of(true);
    })
  );
};
