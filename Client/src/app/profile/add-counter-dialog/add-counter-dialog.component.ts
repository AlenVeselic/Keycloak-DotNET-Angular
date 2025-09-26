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

import { RestApiEndpoint } from '../../_rest/APIEndpoint';

export interface DialogData {
  user: any;
  allRoles: any[];
}

@Component({
  selector: 'app-add-counter-dialog',
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
  templateUrl: './add-counter-dialog.component.html',
  styleUrl: './add-counter-dialog.component.css',
})
export class AddCounterDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AddCounterDialogComponent>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly http = inject(HttpClient);

  newCounterName: string = '';

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChanges(): void {
    const newCounter = { name: this.newCounterName };
    this.http.post(RestApiEndpoint.CREATE_COUNTER, newCounter).subscribe({
      next: (response) => {
        console.log('Counter created:', response);
      },
      error: (err) => {
        console.log('Error creating counter:', err);
      },
    });
    this.dialogRef.close();
  }
}
