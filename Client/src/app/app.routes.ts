import { Routes } from "@angular/router";
import { authGuard } from "./_auth/guard/auth.guard";
import { logoutRouteGuard } from "./_auth/guard/logout-route.guard";
import { NotFoundComponent } from "./common/notfound/notfound.component";

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        loadComponent : () =>
            import('./main/main.component')
        .then((mod) => mod.MainComponent)
    },
    {
        path: 'unprotected',
        loadComponent : () =>
            import('./unprotected/unprotected.component')
        .then((mod) => mod.UnprotectedComponent)      
    },
    {
        path: 'protected',
        canActivate: [authGuard],
        loadComponent : () =>
            import('./protected/protected.component')
        .then((mod) => mod.ProtectedComponent)
    },
    {
        path: 'logout',
        canActivate: [logoutRouteGuard],
        loadComponent : () =>
            import('./common/logout/logout.component')
        .then((mod) => mod.LogoutComponent)      
    },
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
]