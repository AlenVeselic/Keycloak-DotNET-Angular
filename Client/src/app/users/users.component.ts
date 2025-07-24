import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

enum KeycloakAdminEndpoint {
  VIEW_USERS = 'http://localhost:28080/admin/realms/my-realm/users',
}

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: any;
  usersError = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    ///admin/view-users
    // view-users role from client roles
    this.usersError = false;
    this.http.get<any[]>(KeycloakAdminEndpoint.VIEW_USERS).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => {
        this.users = JSON.stringify(err);
        this.usersError = true;
      },
    });
  }
}
