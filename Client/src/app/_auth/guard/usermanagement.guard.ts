import { CanActivateFn } from '@angular/router';
import { AuthorizationService } from '../authorization.service';
import { inject } from '@angular/core';

export const userManagementGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthorizationService);

  if (authenticationService.getUserRoles().includes("view-users")) {
    return true;
  }

  return false;
};
