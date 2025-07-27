import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';

enum KeycloakAdminEndpoint {
  VIEW_USERS = 'http://localhost:28080/admin/realms/my-realm/users',
  USER_ROLES = 'http://localhost:28080/admin/realms/my-realm/users/{userId}/role-mappings',
  ALL_ROLES = 'http://localhost:28080/admin/realms/my-realm/clients/{client-uuid}/roles',
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

  allRoles: any[] = [];

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    this.users = [];
    ///admin/view-users
    // view-users role from client roles
    this.usersError = false;

    let users: any = [];
    let allRoles: any = [];

    try {
      allRoles = await lastValueFrom(
        this.http.get<any[]>(
          KeycloakAdminEndpoint.ALL_ROLES.replace(
            '{client-uuid}',
            'my-client-id'
          )
        )
      );
      this.allRoles = allRoles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      this.usersError = true;
      return;
    }

    try {
      users = await lastValueFrom(
        this.http.get<any[]>(KeycloakAdminEndpoint.VIEW_USERS)
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      this.usersError = true;
      this.users = [];
      return;
    }

    this.users = users;
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

      try {
        let userRoles = await lastValueFrom(
          this.http.get<any>(
            KeycloakAdminEndpoint.USER_ROLES.replace('{userId}', user.id)
          )
        );
        // Add roles to user object
        user.roles = [];
        if (userRoles.realmMappings && userRoles.realmMappings.length > 0) {
          user.roles.push(
            ...(userRoles.realmMappings?.map(
              (role: { name: string }) => role.name
            ) || [])
          );
        }
        if (
          userRoles.clientMappings &&
          Object.values(userRoles.clientMappings).length > 0
        ) {
          let clients = Object.keys(userRoles.clientMappings);
          for (const client of clients) {
            user.roles.push(
              ...(userRoles.clientMappings[client]?.mappings.map(
                (role: { name: string }) => role.name
              ) || [])
            );
          }
        }
        console.log('User roles:', user.roles);
      } catch (error) {
        console.error('Error fetching roles for user:', user.id, error);
        user.roles = []; // Ensure roles is always defined
      }
    }
  }
}
