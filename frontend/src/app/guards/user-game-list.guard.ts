import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const userGameListGuard:  CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return authService.isLoggedIn$.pipe(
    switchMap((isLoggedIn) => {
      if (!isLoggedIn){
        return router.navigate(['login']).then(() => false);
      }
      const loggedInUserId = authService.getParsedToken().Id.toString();
      const userIdFromRoute = route.params['userId'].toString();

      if(loggedInUserId !== userIdFromRoute){
        return router.navigate(['forbidden']).then(() => false);
      }
      return of(true);
    })
  );
};
