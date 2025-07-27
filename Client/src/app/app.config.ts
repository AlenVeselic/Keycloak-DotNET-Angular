import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { provideKeycloakAngular } from '../keycloak.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideKeycloakAngular(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
  ],
};
