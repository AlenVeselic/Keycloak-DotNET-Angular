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
  }
}
