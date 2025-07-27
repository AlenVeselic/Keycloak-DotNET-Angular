import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

enum KeycloakAdminEndpoint {
  VIEW_USERS = 'http://localhost:28080/admin/realms/my-realm/users',
  USER_ROLES = 'http://localhost:28080/admin/realms/my-realm/users/{userId}/role-mappings',
}
@Component({
  selector: 'app-users',
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: any;
  usersError = false;
  userKeys: string[] = [];
  regularCellKeys: string[] = [
    'id',
    'username',
    'emailVerified',
    'enabled',
    'totp',
  ];

  arrayCellKeys: string[] = ['roles'];

  todoColumns: string[] = ['requiredActions'];

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
          delete this.users[0]['userProfileMetadata'];
          delete this.users[0]['disableableCredentialTypes'];
          delete this.users[0]['requiredActions'];
          delete this.users[0]['access'];
          delete this.users[0]['notBefore'];
          this.userKeys = [
            ...this.regularCellKeys,
            ...this.arrayCellKeys,
            'actions',
          ];
        }

        for (const user of this.users) {
          // Remove sensitive information
          delete user['credentials'];
          delete user['access'];
          delete user['federatedIdentities'];
          delete user['requiredActions'];
          delete user['attributes'];
          delete user['clientConsents'];
          delete user['userProfileMetadata'];

          this.http
            .get<any>(
              KeycloakAdminEndpoint.USER_ROLES.replace('{userId}', user.id)
            )
            .subscribe({
              next: (rolesResponse) => {
                // Add roles to user object
                user.roles = [];
                if (
                  rolesResponse.realmMappings &&
                  rolesResponse.realmMappings.length > 0
                ) {
                  user.roles.push(
                    ...(rolesResponse.realmMappings?.map(
                      (role: { name: string }) => role.name
                    ) || [])
                  );
                }
                if (
                  rolesResponse.clientMappings &&
                  Object.values(rolesResponse.clientMappings).length > 0
                ) {
                  let clients = Object.keys(rolesResponse.clientMappings);
                  for (const client of clients) {
                    user.roles.push(
                      ...(rolesResponse.clientMappings[client]?.mappings.map(
                        (role: { name: string }) => role.name
                      ) || [])
                    );
                  }
                }
                console.log('User roles:', user.roles);
              },
              error: (err) => {
                console.error('Error fetching user roles:', err);
                user.roles = []; // Ensure roles is always defined
              },
            });
        }
      },
      error: (err) => {
        this.users = JSON.stringify(err);
        this.usersError = true;
      },
    });
  }
}
