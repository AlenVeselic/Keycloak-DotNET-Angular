import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RestApiEndpoint } from '../_rest/APIEndpoint';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profileData: { id: string; bio: string } | any;
  profileDataError = false;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    // USER role from realm roles
    this.http.get(RestApiEndpoint.GET_PROFILE).subscribe({
      next: (response) => {
        this.profileData = response;
      },
      error: (err) => {
        this.profileDataError = true;
        console.log(err);
      },
    });
  }
}
