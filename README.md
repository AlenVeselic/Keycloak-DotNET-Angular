# DotNet-Angular-Keycloak-Demo

This project is a simple demo on how **Keycloak** is integrated for authentication in an Angular 20+ frontend and a .NET Core 9 backend.

Based on [This repository](https://github.com/hristijanZdravev/DotNet-Angular-Keycloak-Demo). Updated with realm provisioning, .NET 9 and Angular 20.

## Tutorials Used

- Step-by-step guide for setting up Keycloak OAuth2 in Angular and .NET Core:  
  [Miloš Željko's Tutorial](https://miloszeljko.com/step-by-step-guide-setting-up-keycloak-oauth2-in-angular-and-net-core-for-secure-authentication/)

- Help for implementing Keycloak in Angular 18+:  
  [Pretius Blog on Keycloak Angular Integration](https://pretius.com/blog/keycloak-angular-integration/)

## Keycloak Angular Package

This project uses the **Keycloak Angular** package for integration with Angular.  
NPM Package: [keycloak-angular](https://www.npmjs.com/package/keycloak-angular)

## Features

- Secure authentication using OAuth2 with Keycloak
- Integration with Angular's standalone components
- Backend API secured with Keycloak

## Setup Instructions

### 1. Backend API (ASP.NET Core)

The backend API is set up in Visual Studio Code. To get started, follow these steps:

1. Ensure you have .NET 9 installed.
2. Run `dotnet build`.
3. Run `dotnet run` or use the `Run and Debug tab` to run the API with debug output.

### 2. Frontend (Angular)

## Prerequisites:

- Node 22.12
- Angular CLI installed (`npm i -g @angular/cli`)

To start the Angular app:

1. Open a terminal in the Angular project directory.
2. `npm i` to install all packages,
3. Run `npm start` to start the Angular development server.
4. The Angular app should be accessible at `http://localhost:4200`.

### 3. Keycloak Setup with Docker Compose

## Prerequisites

- Docker
- Docker compose

To start Keycloak using Docker:

1. Ensure you have Docker installed and running on your machine.
2. In the root directory of the project, run the following command to start Keycloak:

   ```bash
   docker-compose up -d
   ```

3. This will start the Keycloak container in detached mode. Once running, you can access Keycloak at `http://localhost:8080`.

   - You can also run it without -d if you like logs.

4. Due to the volumes line, the realm shoudl be automatically provisioned.
5. Add a user to the my-realm realm.
   - add a password in the User's credentials tab,
   - Navigate to Role Mappings, here you can assign either the ADMIN or USER roles.
   - Whenever your change the role, you can refresh the Angular frontend and see that the roles have change.
     - With the network tab open on the Home page, you can also see if your user's authorization challenge succeeds or not on the backend.
