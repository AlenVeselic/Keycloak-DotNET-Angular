import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  authenticated: boolean | undefined = false;
  isUser = false;
  isAdmin = false;

  constructor(private authService: AuthorizationService) {
    this.authenticated = this.authService.isLoggedIn();
    if (this.authenticated) {
      const roles = this.authService.getUserRoles();
      this.isUser = roles.includes(UserRole.USER);
      this.isAdmin = roles.includes(UserRole.ADMIN);
    }
  }

  ngOnInit() {}
}
