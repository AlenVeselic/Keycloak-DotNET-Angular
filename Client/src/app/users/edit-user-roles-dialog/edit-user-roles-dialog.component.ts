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
    MatDialogClose,
  ],
  templateUrl: './edit-user-roles-dialog.component.html',
  styleUrl: './edit-user-roles-dialog.component.css',
})
export class EditUserRolesDialogComponent {
  readonly dialogRef = inject(MatDialogRef<EditUserRolesDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly user = model(this.data.user);
  readonly allRoles = this.data.allRoles;
  parsedAllRoles: any[] = [];

  ngOnInit() {
    this.parsedAllRoles = this.allRoles.map((role) => role.name);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    // Logic to save changes
    console.log('Changes saved for user:', this.user);
    this.dialogRef.close(this.user);
  }
}
