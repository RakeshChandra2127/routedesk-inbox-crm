import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>OmniDesk Hub</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" fullWidth>
            <mat-label>Email</mat-label>
            <input matInput type="email">
          </mat-form-field>
          <mat-form-field appearance="outline" fullWidth>
            <mat-label>Password</mat-label>
            <input matInput type="password">
          </mat-form-field>
        </mat-card-content>
        <mat-card-actions>
          <button mat-flat-button color="primary" fullWidth>Sign In</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper { height: 100vh; display: flex; justify-content: center; align-items: center; background: var(--bg-dark); }
    .login-card { width: 100%; max-width: 400px; padding: 24px; background: var(--bg-panel); color: white; }
    mat-form-field { width: 100%; margin-bottom: 16px; }
  `]
})
export class LoginComponent {}
