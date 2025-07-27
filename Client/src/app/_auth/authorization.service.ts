import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private profile: any;
  constructor(private readonly keycloak: Keycloak) {}

  isLoggedIn(): boolean | undefined {
    if (!this.keycloak) {
      console.error('Keycloak service is not initialized');
      return false;
    }
    if (!this.keycloak.authenticated) {
      console.warn('User is not authenticated');
      return false;
    }
    if (this.keycloak.authenticated && !this.profile) {
      this.keycloak
        .loadUserProfile()
        .then((profile) => {
          this.profile = profile;
        })
        .catch((error) => {
          console.error('Failed to load user profile:', error);
        });
    }
    return this.keycloak.authenticated;
  }

  login(): void {
    console.log(this.keycloak);
    this.keycloak.login();

    if (this.keycloak.authenticated) {
      this.keycloak.loadUserProfile().then((profile) => {
        this.profile = profile;
      });
    }
  }

  logout(): void {
    this.keycloak.logout();
  }

  get userName(): string {
    return this.profile.username || '';
  }

  getUserRoles(): any[] {
    let roles: any[] = [];
    if (!this.keycloak || !this.keycloak.tokenParsed) {
      console.warn('Keycloak service or tokenParsed is not available');
      return roles;
    }
    if (this.keycloak.realmAccess && this.keycloak.realmAccess.roles) {
      roles = this.keycloak.realmAccess.roles;
    }
    if (this.keycloak.resourceAccess) {
      for (const resource of Object.values(this.keycloak.resourceAccess)) {
        if (resource.roles) {
          roles = roles.concat(resource.roles);
        }
      }
    }
    console.log('User roles:', roles);
    return roles;
  }
}
