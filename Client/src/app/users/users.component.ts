import { Component } from '@angular/core';
import { AuthorizationService } from '../_auth/authorization.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { lastValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { EditUserRolesDialogComponent } from './edit-user-roles-dialog/edit-user-roles-dialog.component';
import { KeycloakAdminEndpoint } from '../_auth/models/keycloak-admin-endpoint';
@Component({
  selector: 'app-users',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    EditUserRolesDialogComponent,
  ],
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
  allClients: any[] = [];
  clientsToGetRolesFrom: any[] = ['realm-management'];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  async ngOnInit() {
    this.users = [];
    ///admin/view-users
    // view-users role from client roles
    this.usersError = false;

    let users: any = [];
    let allRoles: any = [];

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

    let clientIds = [];
    try {
      this.allClients = await lastValueFrom(
        this.http.get<any[]>(KeycloakAdminEndpoint.ALL_CLIENTS)
      );
      this.allClients = this.allClients.filter((client) =>
        this.clientsToGetRolesFrom.includes(client.clientId)
      );
      clientIds = this.allClients.map((client) => client.id);
    } catch (error) {
      console.error('Error fetching clients:', error);
      this.usersError = true;
      return;
    }

    try {
      let realmRoles = await lastValueFrom(
        this.http.get<any[]>(KeycloakAdminEndpoint.ALL_REALM_ROLES)
      );
      this.allRoles.push(...realmRoles);
    } catch (error) {
      console.error('Error fetching realm roles:', error);
      this.usersError = true;
      return;
    }

    try {
      for (const clientUUID of clientIds) {
        let clientRoles = await lastValueFrom(
          this.http.get<any[]>(
            KeycloakAdminEndpoint.ALL_CLIENT_ROLES.replace(
              '{client-uuid}',
              clientUUID
            )
          )
        );
        this.allRoles.push(...clientRoles);
      }
    } catch (error) {
      console.error('Error fetching client roles:', error);
      this.usersError = true;
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

  editUserRoles(user: any) {
    // Logic to edit user roles
    console.log('Edit roles for user:', user, this.allRoles);
    const dialogRef = this.dialog.open(EditUserRolesDialogComponent, {
      width: '400px',
      data: { user, allRoles: this.allRoles },
    });
  }
}
