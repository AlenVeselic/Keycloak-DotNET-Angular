# Full stack application with auth (.NET 9 - Angular 20 - Keycloak)

This project is a simple template of a full stack application that integrates **Keycloak** as auth. The stack includes a **.NET9 API** and an **Angular 20** frontend.

## Original repository

[Original repository](https://github.com/hristijanZdravev/DotNet-Angular-Keycloak-Demo).

## Keycloak Angular Package

This project uses the **Keycloak Angular** package for integration with Angular.  
NPM Package: [keycloak-angular](https://www.npmjs.com/package/keycloak-angular)

## Features

- Secure authentication using OAuth2 with Keycloak,
- Realm provisioning,
- Integration with Angular's standalone components,
- Example of role based authorization,
  - Locked API endpoint bsed on role,
  - Display users based on user role within keycloak,
- Backend API secured with Keycloak.

## Setup Instructions

### 1. Backend API (ASP.NET Core)

The backend API is set up in Visual Studio Code. To get started, follow these steps:

1. Ensure you have .NET 9 installed.
2. Run `dotnet build`.
3. Run `dotnet run` or use the `Run and Debug tab` to run the API with debug output.

### 2. Frontend (Angular)

#### Prerequisites:

- Node 22.12
- Angular CLI installed (`npm i -g @angular/cli`)

To start the Angular app:

1. Open a terminal in the Angular project directory.
2. `npm i` to install all packages,
3. Run `npm start` to start the Angular development server.
4. The Angular app should be accessible at `http://localhost:4200`.

### 3. Keycloak Setup with Docker Compose

#### Prerequisites

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

4. Due to the volumes line, the realm should be automatically provisioned.
5. Log into keycloak as admin and navigate to the my-realm realm.
6. Add a user to the my-realm realm.

   - add a password in the User's credentials tab,
   - Navigate to Role Mappings, here you can assign either the ADMIN or USER roles.
   - Whenever your change the role, you can refresh the Angular frontend and see that the roles have change.

     - With the network tab open on the Home page, you can also see if your user's authorization challenge succeeds or not on the backend.
       - This data has now been added to the ADMIN user homepage.

   - If you assign your test user the view-users role, the angular client also displays the users on the homepage.

### 4. Running all projects with a VS Code task

If you've succesfully built all the projects and are using VS Code, you can run all the project using the configured tasks.

1. Use the keyboard shortcut `CTRL + SHIFT + P`,
2. Search tasks and find `Run tasks`,
3. Run the `Run all projects` task
4. This should open 3 terminals in parallel and display all the pieces of the project in their own window.
