import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-navbar',
    imports: [
        CommonModule,
        RouterModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authenticated: boolean;
  isUserManager: boolean;

  constructor(private authService: AuthorizationService, private http: HttpClient) {
    this.authenticated = this.authService.isLoggedIn();
    this.isUserManager = this.authService.getUserRoles().includes("view-users");

  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

}
