import { CanActivateFn, Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';
import { inject } from '@angular/core';

export const logoutRouteGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthorizationService);
  const router = inject(Router);
  if (!authenticationService.isLoggedIn()) {
    return true;
  } else {
    return router.createUrlTree(['']);
  }
};
