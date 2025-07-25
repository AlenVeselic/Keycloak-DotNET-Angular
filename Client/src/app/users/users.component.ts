import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

enum KeycloakAdminEndpoint {
  VIEW_USERS = 'http://localhost:28080/admin/realms/my-realm/users',
}
@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: any;
  usersError = false;
  userKeys: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.users = [];
    ///admin/view-users
    // view-users role from client roles
    this.usersError = false;
    this.http.get<any[]>(KeycloakAdminEndpoint.VIEW_USERS).subscribe({
      next: (response) => {
        this.users = response;
        if (this.users.length > 0) {
          this.userKeys = Object.keys(this.users[0]);
        }
      },
      error: (err) => {
        this.users = JSON.stringify(err);
        this.usersError = true;
      },
    });
  }
}
