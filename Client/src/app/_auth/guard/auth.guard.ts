import { CanActivateFn } from '@angular/router';
import { AuthorizationService } from '../authorization.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthorizationService);

  if (authenticationService.isLoggedIn()) {
    return true;
  }
  authenticationService.login();
  
  return false;
};
