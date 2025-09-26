import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RestApiEndpoint } from '../_rest/APIEndpoint';
import { AddCounterDialogComponent } from './add-counter-dialog/add-counter-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profileData: { id: string; bio: string } | any;
  profileDataError = false;

  counterData: { id: string; amount: string; name: string }[] | any;

  constructor(private http: HttpClient, private dialog: MatDialog) {}
  ngOnInit() {
    // Extended profile info from API
    this.http.get(RestApiEndpoint.GET_PROFILE).subscribe({
      next: (response) => {
        this.profileData = response;
      },
      error: (err) => {
        this.profileDataError = true;
        console.log(err);
      },
    });

    // Get user counters from API
    this.fetchCounters();
  }

  createCounter() {
    // Open dialog to create a new counter
    console.log('Creating counter...');
    const dialogRef = this.dialog.open(AddCounterDialogComponent, {
      width: '300px',
    });
    // After dialog is closed, refresh the counter list

    dialogRef.afterClosed().subscribe(() => {
      this.fetchCounters();
    });

    console.log('Counter creation dialog closed');
  }

  incrementCounter(counterId: string) {
    const endpoint = RestApiEndpoint.UPDATE_COUNTER_AMOUNT.replace(
      '{id}',
      counterId
    );
    const currentAmount = this.counterData.find(
      (c: any) => c.id === counterId
    ).amount;

    const incrementedAmount = Number.parseInt(currentAmount) + 1;

    const updateData = {
      amount: incrementedAmount.toString(),
    };
    this.http.put<{ amount: string }>(endpoint, updateData).subscribe({
      next: (response: { amount: string }) => {
        console.log('Counter updated:', response);
        const counter = this.counterData.find((c: any) => c.id === counterId);
        if (counter) {
          counter.amount = response.amount;
        }
      },
      error: (err) => {
        console.log('Error updating counter:', err);
      },
    });
  }

  fetchCounters() {
    this.http.get(RestApiEndpoint.GET_USER_COUNTERS).subscribe({
      next: (response) => {
        this.counterData = response;
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
