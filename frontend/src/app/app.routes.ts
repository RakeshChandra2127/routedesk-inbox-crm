import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { InboxComponent } from './features/inbox/inbox.component';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inbox', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inbox', component: InboxComponent, canActivate: [authGuard] },
  // Additional routes placeholder - components implemented inline or directly
];
