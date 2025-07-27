export enum KeycloakAdminEndpoint {
  VIEW_USERS = 'http://localhost:28080/admin/realms/my-realm/users',
  USER_ROLES = 'http://localhost:28080/admin/realms/my-realm/users/{userId}/role-mappings',
  ALL_REALM_ROLES = 'http://localhost:28080/admin/realms/my-realm/roles',
  ALL_CLIENT_ROLES = 'http://localhost:28080/admin/realms/my-realm/clients/{client-uuid}/roles',
  ALL_CLIENTS = 'http://localhost:28080/admin/realms/my-realm/clients',
  USER_CLIENT_ROLE_MAPPINGS = 'http://localhost:28080/admin/realms/my-realm/users/{userId}/role-mappings/clients/{clientId}',
  USER_REALM_ROLE_MAPPINGS = 'http://localhost:28080/admin/realms/my-realm/users/{userId}/role-mappings/realm',
}
