import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

enum RestApiEndpoint {
  WEATHER_FORECAST = 'http://localhost:5159/weatherforecast',
}

enum KeycloakAdminEndpoint {
  VIEW_USERS = 'http://localhost:28080/admin/realms/my-realm/users',
}

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent {
  authenticated = false;
  isUser = false;
  isAdmin = false;

  weatherData: any;
  weatherDataError = false;

  users: any;
  usersError = false;

  constructor(
    private authService: AuthorizationService,
    private http: HttpClient
  ) {
    this.authenticated = this.authService.isLoggedIn();
    if (this.authenticated) {
      const roles = this.authService.getUserRoles();
      this.isUser = roles.includes(UserRole.USER);
      this.isAdmin = roles.includes(UserRole.ADMIN);
    }
  }

  // ADMIN role from realm roles
  ngOnInit() {
    this.http.get(RestApiEndpoint.WEATHER_FORECAST).subscribe({
      next: (response) => {
        console.log(response);
        this.weatherData = response;
      },
      error: (err) => {
        console.log(err);
        this.weatherDataError = true;
        this.weatherData = err;
      },
    });

    ///admin/view-users
    // view-users role from client roles
    this.usersError = false;
    this.http.get<any[]>(KeycloakAdminEndpoint.VIEW_USERS).subscribe({
      next: (response) => {
        console.log(response);

        this.users = response;
      },
      error: (err) => {
        console.log(err);
        this.users = JSON.stringify(err);
        this.usersError = true;
      },
    });
  }
}
