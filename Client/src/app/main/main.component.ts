import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-main',
    imports: [CommonModule],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css'
})
export class MainComponent {
  authenticated = false;
  isUser = false;
  isAdmin = false;
  weatherData: any;

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

  ngOnInit() {
    this.http.get('http://localhost:5159/weatherforecast').subscribe({
      next: (response) => {
        console.log(response);
        this.weatherData =JSON.stringify(response);
      },
      error: (err) => {
        console.log(err);
        this.weatherData = err;
      },
    });
    ///admin/realms
    //  this.http.get('http://localhost:28080/admin/realms/my-realm/users').subscribe({
    //   next: (response) =>{
    //     console.log(response);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    //  });
  }
}
