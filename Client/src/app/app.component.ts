import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AuthorizationService } from './_auth/authorization.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterModule,
        NavbarComponent
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-app';

}
