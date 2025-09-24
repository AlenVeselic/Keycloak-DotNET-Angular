import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RestApiEndpoint } from '../_rest/APIEndpoint';

@Component({
  selector: 'app-weather',
  imports: [CommonModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css',
})
export class WeatherComponent {
  weatherData: any;
  weatherDataError = false;
  constructor(private http: HttpClient) {}
  ngOnInit() {
    // ADMIN role from realm roles
    this.http.get(RestApiEndpoint.WEATHER_FORECAST).subscribe({
      next: (response) => {
        console.log(response);
        this.weatherData = response;
      },
      error: (err) => {
        console.log(err);
        this.weatherDataError = true;
        this.weatherData = err;
      },
    });
  }
}
