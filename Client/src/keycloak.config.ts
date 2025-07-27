import {
  provideKeycloak,
  createInterceptorCondition,
  IncludeBearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  withAutoRefreshToken,
  AutoRefreshTokenService,
  UserActivityService,
} from 'keycloak-angular';

const localhostCondition =
  createInterceptorCondition<IncludeBearerTokenCondition>({
    urlPattern: /^(http:\/\/localhost:5159)(\/.*)?$/i,
  });

export const provideKeycloakAngular = () =>
  provideKeycloak({
    config: {
      url: 'http://localhost:28080',
      realm: 'my-realm',
      clientId: 'my-angular-client',
    },
    initOptions: {
      onLoad: 'check-sso',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri:
        window.location.origin + '/assets/silent-check-sso.html',
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 1000,
      }),
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: [localhostCondition],
      },
    ],
  });
