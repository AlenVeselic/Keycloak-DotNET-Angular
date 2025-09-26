import { Component, inject, Inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { KeycloakAdminEndpoint } from '../../_auth/models/keycloak-admin-endpoint';

export interface DialogData {
  user: any;
  allRoles: any[];
}

@Component({
  selector: 'app-edit-user-roles-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './edit-user-roles-dialog.component.html',
  styleUrl: './edit-user-roles-dialog.component.css',
})
export class EditUserRolesDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditUserRolesDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly http = inject(HttpClient);
  readonly user = model(this.data.user);
  readonly allRoles = this.data.allRoles;
  parsedAllRoles: any[] = [];
  previouslySelectedRoles: any[] = [];

  ngOnInit() {
    this.parsedAllRoles = this.allRoles.map((role) => role.name);
    this.previouslySelectedRoles = this.data.user.roles.map(
      (role: any) => role
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    let rolesToAdd = this.data.user.roles.filter(
      (role: string) => !this.previouslySelectedRoles.includes(role)
    );
    let rolesToRemove = this.previouslySelectedRoles
      .filter((role: string) => !this.data.user.roles.includes(role))
      .filter((role) => role !== undefined);

    let realmRolesToAdd: any[] = [];
    let realmRolesToRemove: string[] = [];

    let clientRolesToAdd: { [clientId: string]: string[] } = {};
    let clientRolesToRemove: { [clientId: string]: string[] } = {};

    rolesToRemove.forEach((role: string) => {
      const roleFound = this.allRoles.find((r) => r.name === role);

      if (roleFound) {
        if (roleFound.clientRole && roleFound.containerId) {
          if (!clientRolesToRemove[roleFound.containerId]) {
            clientRolesToRemove[roleFound.containerId] = [];
          }
          clientRolesToRemove[roleFound.containerId].push(roleFound);
        } else {
          realmRolesToRemove.push(roleFound);
        }
      }
    });

    rolesToAdd.forEach((role: any) => {
      const userRoleFoundInAllRoles = this.allRoles.find(
        (r) => r.name === role
      );
      if (userRoleFoundInAllRoles) {
        if (
          userRoleFoundInAllRoles.clientRole &&
          userRoleFoundInAllRoles.containerId
        ) {
          if (!clientRolesToAdd[userRoleFoundInAllRoles.containerId]) {
            clientRolesToAdd[userRoleFoundInAllRoles.containerId] = [];
          }
          clientRolesToAdd[userRoleFoundInAllRoles.containerId].push(
            userRoleFoundInAllRoles
          );
        } else {
          realmRolesToAdd.push(userRoleFoundInAllRoles);
        }
      }
    });

    for (const clientId of Object.keys(clientRolesToRemove)) {
      if (clientRolesToRemove.hasOwnProperty(clientId)) {
        this.http
          .delete(
            KeycloakAdminEndpoint.USER_CLIENT_ROLE_MAPPINGS.replace(
              '{userId}',
              this.data.user.id
            ).replace('{clientId}', clientId),
            {
              body: [...clientRolesToRemove[clientId]],
            }
          )
          .subscribe({
            next: () =>
              console.log(
                `Removed client roles ${clientRolesToRemove[clientId]} for client ${clientId}`
              ),
          });
      }
    }

    if (realmRolesToRemove.length > 0) {
      console.log(
        `Removing realm roles ${realmRolesToRemove} from user ${this.data.user.id}`
      );
      this.http
        .delete(
          KeycloakAdminEndpoint.USER_REALM_ROLE_MAPPINGS.replace(
            '{userId}',
            this.data.user.id
          ),
          { body: [...realmRolesToRemove] }
        )
        .subscribe({
          next: () => console.log(`Removed realm roles ${realmRolesToRemove}`),
        });
    }
    if (clientRolesToAdd && Object.keys(clientRolesToAdd).length > 0) {
      for (const clientId of Object.keys(clientRolesToAdd)) {
        if (clientRolesToAdd.hasOwnProperty(clientId)) {
          console.log(
            `Adding roles ${clientRolesToAdd[clientId]} to client ${clientId}`
          );
          this.http
            .post(
              KeycloakAdminEndpoint.USER_CLIENT_ROLE_MAPPINGS.replace(
                '{userId}',
                this.data.user.id
              ).replace('{clientId}', clientId),
              [...clientRolesToAdd[clientId]]
            )
            .subscribe({
              next: () =>
                console.log(`Added client roles for client ${clientId}`),
            });
        }
      }
    }

    if (realmRolesToAdd.length > 0) {
      console.log(
        `Adding realm roles ${realmRolesToAdd} to user ${this.data.user.id}`
      );
      this.http
        .post(
          KeycloakAdminEndpoint.USER_REALM_ROLE_MAPPINGS.replace(
            '{userId}',
            this.data.user.id
          ),

          [...realmRolesToAdd]
        )
        .subscribe({
          next: () =>
            console.log(
              `Added realm roles ${realmRolesToAdd} to user ${this.data.user.id}`
            ),
        });
    }

    this.dialogRef.close(this.user);
  }
}
