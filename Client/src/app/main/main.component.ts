import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
  users: any;

  constructor(
    private authService: AuthorizationService,
    private http: HttpClient
  ) {
    this.authenticated = this.authService.isLoggedIn();
    if (this.authenticated) {
      const roles = this.authService.getUserRoles();
      console.log(roles.includes('ADMIN'));
      this.isUser = roles.includes('USER');
      this.isAdmin = roles.includes('ADMIN');
    }
  }

  // ADMIN role from realm roles
  ngOnInit() {
    this.http.get('http://localhost:5159/weatherforecast').subscribe({
      next: (response) => {
        console.log(response);
        this.weatherData = response;
      },
      error: (err) => {
        console.log(err);
        this.weatherData = JSON.stringify(err);
      },
    });
    ///admin/realms
    // view-users role from client roles
    this.http
      .get<any[]>('http://localhost:28080/admin/realms/my-realm/users')
      .subscribe({
        next: (response) => {
          console.log(response);

          this.users = response;
        },
        error: (err) => {
          console.log(err);
          this.users = JSON.stringify(err);
        },
      });
  }
}
