import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule, MatBadgeModule, MatMenuModule],
  template: `
    <mat-sidenav-container class="app-container">
      <mat-sidenav mode="side" opened class="app-sidenav">
        <div class="brand">
          <mat-icon>headset_mic</mat-icon>
          <span>OmniDesk Hub</span>
        </div>
        <mat-nav-list>
          <a mat-list-item routerLink="/inbox" routerLinkActive="active">
            <mat-icon matListItemIcon>inbox</mat-icon>
            <span matListItemTitle>Inbox</span>
          </a>
          <a mat-list-item routerLink="/tickets" routerLinkActive="active">
            <mat-icon matListItemIcon>confirmation_number</mat-icon>
            <span matListItemTitle>Tickets</span>
          </a>
          <a mat-list-item routerLink="/contacts" routerLinkActive="active">
            <mat-icon matListItemIcon>contacts</mat-icon>
            <span matListItemTitle>Contacts</span>
          </a>
          <a mat-list-item routerLink="/team" routerLinkActive="active">
            <mat-icon matListItemIcon>groups</mat-icon>
            <span matListItemTitle>Team</span>
          </a>
          <a mat-list-item routerLink="/analytics" routerLinkActive="active">
            <mat-icon matListItemIcon>analytics</mat-icon>
            <span matListItemTitle>Analytics</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar>
          <span>Unified Workspace</span>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
          </button>
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item><mat-icon>circle</mat-icon> Online</button>
            <button mat-menu-item><mat-icon>remove_circle</mat-icon> Busy</button>
            <button mat-menu-item><mat-icon>logout</mat-icon> Logout</button>
          </mat-menu>
        </mat-toolbar>
        <div class="main-content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .app-container { height: 100vh; }
    .app-sidenav { width: 260px; background: #1e293b; color: white; border-right: 1px solid #334155; }
    .brand { padding: 24px 16px; display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: bold; border-bottom: 1px solid #334155; }
    .spacer { flex: 1 1 auto; }
    .mat-mdc-nav-list { padding-top: 16px; }
    a.active { background: rgba(59, 130, 246, 0.15); color: #3b82f6; border-right: 3px solid #3b82f6; }
    .main-content { height: calc(100vh - 64px); overflow: hidden; }
  `]
})
export class AppComponent {
  private socketService = inject(SocketService);
  constructor() {
    this.socketService.connect();
  }
}
