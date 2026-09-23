import os
import json

BASE_DIR = r"C:\Users\RAKESH CHANDRA\.gemini\antigravity\scratch\omnidesk-hub\frontend"

def write(path, content):
    full_path = os.path.join(BASE_DIR, path.replace('/', '\\'))
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')

FILES = {}

FILES["package.json"] = r"""
{
  "name": "omnidesk-frontend",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve --proxy-config proxy.conf.json",
    "build": "ng build",
    "test": "ng test"
  },
  "dependencies": {
    "@angular/animations": "^18.2.0",
    "@angular/cdk": "^18.2.0",
    "@angular/common": "^18.2.0",
    "@angular/compiler": "^18.2.0",
    "@angular/core": "^18.2.0",
    "@angular/forms": "^18.2.0",
    "@angular/material": "^18.2.0",
    "@angular/platform-browser": "^18.2.0",
    "@angular/platform-browser-dynamic": "^18.2.0",
    "@angular/router": "^18.2.0",
    "rxjs": "~7.8.0",
    "socket.io-client": "^4.8.0",
    "tslib": "^2.6.0",
    "zone.js": "~0.14.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.2.0",
    "@angular/cli": "^18.2.0",
    "@angular/compiler-cli": "^18.2.0",
    "@types/node": "^22.7.0",
    "typescript": "~5.5.0"
  }
}
"""

FILES["angular.json"] = r"""
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "omnidesk-frontend": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "css",
          "standalone": true
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/omnidesk-frontend",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "css",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "scripts": []
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "proxyConfig": "proxy.conf.json"
          }
        }
      }
    }
  }
}
"""

FILES["tsconfig.json"] = r"""
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "moduleResolution": "bundler",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"]
  }
}
"""

FILES["tsconfig.app.json"] = r"""
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.d.ts"]
}
"""

FILES["proxy.conf.json"] = r"""
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false
  },
  "/socket.io": {
    "target": "http://localhost:3000",
    "secure": false,
    "ws": true
  }
}
"""

FILES["src/environments/environment.ts"] = r"""
export const environment = {
  production: false,
  apiUrl: '/api',
  wsUrl: 'http://localhost:3000'
};
"""

FILES["src/environments/environment.prod.ts"] = r"""
export const environment = {
  production: true,
  apiUrl: '/api',
  wsUrl: ''
};
"""

FILES["src/index.html"] = r"""
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>OmniDesk Hub</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body class="mat-typography mat-app-background">
  <app-root></app-root>
</body>
</html>
"""

FILES["src/styles.css"] = r"""
@import '@angular/material/prebuilt-themes/indigo-pink.css';

:root {
  --bg-dark: #0f172a;
  --bg-panel: #1e293b;
  --text-light: #f8fafc;
  --text-muted: #94a3b8;
  --primary: #3b82f6;
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  
  --whatsapp-color: #25D366;
  --email-color: #3b82f6;
  --web-color: #8b5cf6;
}

body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: var(--bg-dark);
  color: var(--text-light);
  font-family: 'Roboto', sans-serif;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-dark); 
}
::-webkit-scrollbar-thumb {
  background: #334155; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #475569; 
}

/* Material Overrides for Dark Theme */
.mat-app-background {
  background-color: var(--bg-dark);
  color: var(--text-light);
}

.mat-mdc-card {
  background-color: var(--bg-panel) !important;
  color: var(--text-light) !important;
}

.mat-drawer-container {
  background-color: var(--bg-dark) !important;
}

.mat-drawer {
  background-color: var(--bg-panel) !important;
  color: var(--text-light) !important;
  border-right: 1px solid #334155 !important;
}

.mat-toolbar {
  background-color: var(--bg-panel) !important;
  color: var(--text-light) !important;
  border-bottom: 1px solid #334155 !important;
}
"""

FILES["src/main.ts"] = r"""
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
"""

FILES["src/app/app.config.ts"] = r"""
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};
"""

FILES["src/app/models/index.ts"] = r"""
export interface User { id: string; name: string; email: string; avatar?: string; role: string; }
export interface ITicket { id: string; contactId: string; contactName: string; contactAvatar?: string; channel: 'whatsapp' | 'email' | 'web'; subject: string; status: 'open' | 'resolved' | 'escalated' | 'closed'; priority: 'low' | 'medium' | 'high' | 'urgent'; assigneeId?: string; assigneeName?: string; lastMessagePreview: string; unreadCount: number; createdAt: string; updatedAt: string; firstResponseDue: string; slaStatus: 'ok' | 'warning' | 'breached'; }
export interface IMessage { id: string; ticketId: string; senderId: string; senderType: 'agent' | 'contact' | 'system'; content: string; createdAt: string; deliveryStatus: 'sent' | 'delivered' | 'read'; }
export interface Contact { id: string; name: string; phone: string; email: string; avatar?: string; leadStatus: 'new' | 'contacted' | 'qualified' | 'customer'; totalTickets: number; lastContacted: string; }
export interface IPresencePayload { userId: string; status: 'online' | 'busy' | 'away' | 'offline'; lastActive: string; }
export interface ITypingPayload { ticketId: string; userId: string; isTyping: boolean; }
export interface ISLAAlertPayload { ticketId: string; slaStatus: 'warning' | 'breached'; remainingSeconds: number; }
"""

FILES["src/app/interceptors/auth.interceptor.ts"] = r"""
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
"""

FILES["src/app/guards/auth.guard.ts"] = r"""
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) return true;
  router.navigate(['/login']);
  return false;
};
"""

FILES["src/app/app.routes.ts"] = r"""
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
"""

FILES["src/app/services/api.service.ts"] = r"""
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(url: string): Observable<T> { return this.http.get<T>(`${this.baseUrl}${url}`); }
  post<T>(url: string, data: any): Observable<T> { return this.http.post<T>(`${this.baseUrl}${url}`, data); }
  put<T>(url: string, data: any): Observable<T> { return this.http.put<T>(`${this.baseUrl}${url}`, data); }
  patch<T>(url: string, data: any): Observable<T> { return this.http.patch<T>(`${this.baseUrl}${url}`, data); }
  delete<T>(url: string): Observable<T> { return this.http.delete<T>(`${this.baseUrl}${url}`); }
}
"""

FILES["src/app/services/auth.service.ts"] = r"""
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSub = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSub.asObservable();

  constructor() {
    const stored = localStorage.getItem('user');
    if (stored) this.currentUserSub.next(JSON.parse(stored));
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  isAuthenticated(): boolean { return !!this.getToken(); }

  login(user: User, token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSub.next(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSub.next(null);
  }
}
"""

FILES["src/app/services/socket.service.ts"] = r"""
import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { IMessage, ITicket, IPresencePayload, ITypingPayload, ISLAAlertPayload } from '../models';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private authService = inject(AuthService);

  connect() {
    const token = this.authService.getToken();
    if (!token) return;
    this.socket = io(environment.wsUrl, { auth: { token } });
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }

  joinTicket(ticketId: string) { this.socket?.emit('ticket:join', { ticketId }); }
  leaveTicket(ticketId: string) { this.socket?.emit('ticket:leave', { ticketId }); }

  emitTypingStart(ticketId: string) { this.socket?.emit('typing:start', { ticketId }); }
  emitTypingStop(ticketId: string) { this.socket?.emit('typing:stop', { ticketId }); }
  emitMessageRead(ticketId: string) { this.socket?.emit('message:read', { ticketId }); }

  onNewMessage(): Observable<IMessage> { return this.onEvent<IMessage>('message:new'); }
  onTicketCreated(): Observable<ITicket> { return this.onEvent<ITicket>('ticket:created'); }
  onTicketUpdated(): Observable<ITicket> { return this.onEvent<ITicket>('ticket:updated'); }
  onPresenceUpdate(): Observable<IPresencePayload> { return this.onEvent<IPresencePayload>('presence:update'); }
  onTypingStart(): Observable<ITypingPayload> { return this.onEvent<ITypingPayload>('typing:start'); }
  onTypingStop(): Observable<ITypingPayload> { return this.onEvent<ITypingPayload>('typing:stop'); }
  onSLAWarning(): Observable<ISLAAlertPayload> { return this.onEvent<ISLAAlertPayload>('sla:warning'); }
  onSLABreached(): Observable<ISLAAlertPayload> { return this.onEvent<ISLAAlertPayload>('sla:breached'); }

  private onEvent<T>(event: string): Observable<T> {
    return new Observable((observer) => {
      this.socket?.on(event, (data: T) => observer.next(data));
      return () => this.socket?.off(event);
    });
  }
}
"""

FILES["src/app/services/ticket.service.ts"] = r"""
import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ITicket } from '../models';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private api = inject(ApiService);
  getTickets() { return this.api.get<ITicket[]>('/tickets'); }
  getTicket(id: string) { return this.api.get<ITicket>(`/tickets/${id}`); }
  resolveTicket(id: string) { return this.api.post(`/tickets/${id}/resolve`, {}); }
  escalateTicket(id: string) { return this.api.post(`/tickets/${id}/escalate`, {}); }
  closeTicket(id: string) { return this.api.post(`/tickets/${id}/close`, {}); }
}
"""

FILES["src/app/services/message.service.ts"] = r"""
import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { IMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private api = inject(ApiService);
  getMessages(ticketId: string) { return this.api.get<IMessage[]>(`/tickets/${ticketId}/messages`); }
  sendMessage(ticketId: string, content: string) { return this.api.post<IMessage>(`/tickets/${ticketId}/messages`, { content }); }
}
"""

FILES["src/app/shared/components/sla-timer/sla-timer.component.ts"] = r"""
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-sla-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sla-badge" [ngClass]="statusClass">
      <span class="material-icons" style="font-size: 14px;">timer</span>
      <span *ngIf="remaining > 0">{{ formatTime(remaining) }}</span>
      <span *ngIf="remaining <= 0">BREACHED</span>
    </div>
  `,
  styles: [`
    .sla-badge { display: flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .status-ok { background: rgba(16, 185, 129, 0.2); color: #10b981; }
    .status-warning { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
    .status-breached { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
  `]
})
export class SlaTimerComponent implements OnInit, OnDestroy {
  @Input() dueDate!: string;
  remaining: number = 0;
  statusClass: string = 'status-ok';
  private sub!: Subscription;

  ngOnInit() {
    this.updateTime();
    this.sub = interval(1000).subscribe(() => this.updateTime());
  }

  ngOnDestroy() { if (this.sub) this.sub.unsubscribe(); }

  updateTime() {
    const diff = new Date(this.dueDate).getTime() - new Date().getTime();
    this.remaining = Math.max(0, Math.floor(diff / 1000));
    if (this.remaining > 300) this.statusClass = 'status-ok';
    else if (this.remaining > 0) this.statusClass = 'status-warning';
    else this.statusClass = 'status-breached';
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
"""

FILES["src/app/shared/components/channel-icon/channel-icon.component.ts"] = r"""
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-channel-icon',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <mat-icon [style.color]="getColor()">
      @switch(channel) {
        @case('whatsapp') { chat }
        @case('email') { email }
        @case('web') { public }
        @default { chat }
      }
    </mat-icon>
  `
})
export class ChannelIconComponent {
  @Input() channel!: string;
  getColor() {
    if (this.channel === 'whatsapp') return '#25D366';
    if (this.channel === 'email') return '#3b82f6';
    if (this.channel === 'web') return '#8b5cf6';
    return '#94a3b8';
  }
}
"""

FILES["src/app/features/inbox/inbox.component.ts"] = r"""
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { TicketService } from '../../services/ticket.service';
import { MessageService } from '../../services/message.service';
import { SocketService } from '../../services/socket.service';
import { ITicket, IMessage } from '../../models';
import { SlaTimerComponent } from '../../shared/components/sla-timer/sla-timer.component';
import { ChannelIconComponent } from '../../shared/components/channel-icon/channel-icon.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-inbox',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatInputModule, MatChipsModule, SlaTimerComponent, ChannelIconComponent],
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {
  private ticketService = inject(TicketService);
  private messageService = inject(MessageService);
  private socketService = inject(SocketService);

  tickets: ITicket[] = [];
  filteredTickets: ITicket[] = [];
  messages: IMessage[] = [];
  selectedTicket: ITicket | null = null;
  
  searchQuery = '';
  newMessage = '';
  isContactTyping = false;
  typingTimeout: any;

  constructor() {
    this.socketService.onNewMessage().pipe(takeUntilDestroyed()).subscribe(msg => {
      if (this.selectedTicket && msg.ticketId === this.selectedTicket.id) {
        this.messages.push(msg);
        setTimeout(() => this.scrollToBottom(), 100);
      }
      const t = this.tickets.find(x => x.id === msg.ticketId);
      if (t) {
        t.lastMessagePreview = msg.content;
        if (!this.selectedTicket || this.selectedTicket.id !== msg.ticketId) t.unreadCount++;
      }
    });

    this.socketService.onTicketCreated().pipe(takeUntilDestroyed()).subscribe(t => {
      this.tickets.unshift(t);
      this.applyFilters();
    });

    this.socketService.onTypingStart().pipe(takeUntilDestroyed()).subscribe(payload => {
      if (this.selectedTicket?.id === payload.ticketId) this.isContactTyping = true;
    });

    this.socketService.onTypingStop().pipe(takeUntilDestroyed()).subscribe(payload => {
      if (this.selectedTicket?.id === payload.ticketId) this.isContactTyping = false;
    });
  }

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    // Mock data for immediate visual rendering if API is not fully up
    this.tickets = [
      { id: '1', contactId: 'c1', contactName: 'Alice Smith', channel: 'whatsapp', subject: 'Login issue', status: 'open', priority: 'high', lastMessagePreview: 'I cannot login to my account.', unreadCount: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), firstResponseDue: new Date(Date.now() + 600000).toISOString(), slaStatus: 'ok' },
      { id: '2', contactId: 'c2', contactName: 'Bob Johnson', channel: 'email', subject: 'Billing question', status: 'open', priority: 'medium', lastMessagePreview: 'Can you send the invoice?', unreadCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), firstResponseDue: new Date(Date.now() + 120000).toISOString(), slaStatus: 'warning' }
    ];
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTickets = this.tickets.filter(t => t.contactName.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  selectTicket(ticket: ITicket) {
    if (this.selectedTicket) this.socketService.leaveTicket(this.selectedTicket.id);
    this.selectedTicket = ticket;
    ticket.unreadCount = 0;
    this.socketService.joinTicket(ticket.id);
    
    // Mock messages
    this.messages = [
      { id: 'm1', ticketId: ticket.id, senderId: 'c1', senderType: 'contact', content: ticket.lastMessagePreview, createdAt: new Date().toISOString(), deliveryStatus: 'read' }
    ];
    setTimeout(() => this.scrollToBottom(), 100);
  }

  onType() {
    if (this.selectedTicket) {
      this.socketService.emitTypingStart(this.selectedTicket.id);
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        if (this.selectedTicket) this.socketService.emitTypingStop(this.selectedTicket.id);
      }, 2000);
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedTicket) return;
    const msg: IMessage = {
      id: Math.random().toString(),
      ticketId: this.selectedTicket.id,
      senderId: 'agent1',
      senderType: 'agent',
      content: this.newMessage,
      createdAt: new Date().toISOString(),
      deliveryStatus: 'sent'
    };
    this.messages.push(msg);
    this.newMessage = '';
    setTimeout(() => this.scrollToBottom(), 100);
  }

  scrollToBottom() {
    const el = document.getElementById('message-area');
    if (el) el.scrollTop = el.scrollHeight;
  }
}
"""

FILES["src/app/features/inbox/inbox.component.html"] = r"""
<div class="inbox-container">
  <!-- LEFT PANEL -->
  <div class="left-panel">
    <div class="search-bar">
      <mat-icon>search</mat-icon>
      <input type="text" placeholder="Search tickets..." [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()">
    </div>
    
    <div class="filters">
      <mat-chip-listbox>
        <mat-chip-option selected>All</mat-chip-option>
        <mat-chip-option>Mine</mat-chip-option>
        <mat-chip-option>Unassigned</mat-chip-option>
      </mat-chip-listbox>
    </div>

    <div class="ticket-list">
      @for (ticket of filteredTickets; track ticket.id) {
        <div class="ticket-item" [class.selected]="selectedTicket?.id === ticket.id" (click)="selectTicket(ticket)">
          <div class="ticket-header">
            <div class="contact-info">
              <app-channel-icon [channel]="ticket.channel"></app-channel-icon>
              <span class="contact-name">{{ticket.contactName}}</span>
            </div>
            <span class="time-ago">Just now</span>
          </div>
          <div class="ticket-body">
            <p class="preview">{{ticket.lastMessagePreview}}</p>
            <div class="badges">
              <span class="unread-badge" *ngIf="ticket.unreadCount > 0">{{ticket.unreadCount}}</span>
              <div class="sla-dot" [ngClass]="'sla-' + ticket.slaStatus"></div>
            </div>
          </div>
        </div>
      }
    </div>
  </div>

  <!-- RIGHT PANEL -->
  <div class="right-panel">
    @if (selectedTicket) {
      <div class="chat-header">
        <div class="header-info">
          <h2>{{selectedTicket.contactName}}</h2>
          <app-sla-timer [dueDate]="selectedTicket.firstResponseDue"></app-sla-timer>
        </div>
        <div class="header-actions">
          <button mat-button color="primary">Resolve</button>
          <button mat-button color="warn">Escalate</button>
        </div>
      </div>

      <div class="message-area" id="message-area">
        @for (msg of messages; track msg.id) {
          <div class="message-wrapper" [class.inbound]="msg.senderType === 'contact'" [class.outbound]="msg.senderType === 'agent'">
            <div class="bubble">
              {{msg.content}}
              <div class="meta">
                <span class="time">12:00 PM</span>
                @if (msg.senderType === 'agent') {
                  <mat-icon class="status-icon">done_all</mat-icon>
                }
              </div>
            </div>
          </div>
        }
        @if (isContactTyping) {
          <div class="typing-indicator">Contact is typing...</div>
        }
      </div>

      <div class="input-area">
        <button mat-icon-button><mat-icon>attach_file</mat-icon></button>
        <textarea placeholder="Type a message..." [(ngModel)]="newMessage" (keyup)="onType()" (keyup.enter)="sendMessage()"></textarea>
        <button mat-icon-button color="primary" (click)="sendMessage()"><mat-icon>send</mat-icon></button>
      </div>
    } @else {
      <div class="empty-state">
        <mat-icon class="empty-icon">inbox</mat-icon>
        <p>Select a ticket to start messaging</p>
      </div>
    }
  </div>
</div>
"""

FILES["src/app/features/inbox/inbox.component.css"] = r"""
.inbox-container {
  display: flex;
  height: calc(100vh - 64px); /* Assuming toolbar is 64px */
  background: var(--bg-dark);
}

.left-panel {
  width: 380px;
  border-right: 1px solid #334155;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
}

.search-bar {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #334155;
}
.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-size: 16px;
}

.filters {
  padding: 8px 16px;
  border-bottom: 1px solid #334155;
}

.ticket-list {
  flex: 1;
  overflow-y: auto;
}

.ticket-item {
  padding: 16px;
  border-bottom: 1px solid #334155;
  cursor: pointer;
  transition: background 0.2s;
}
.ticket-item:hover { background: rgba(255,255,255,0.05); }
.ticket-item.selected { background: rgba(59, 130, 246, 0.1); border-left: 4px solid var(--primary); }

.ticket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.contact-info { display: flex; align-items: center; gap: 8px; }
.contact-name { font-weight: bold; }
.time-ago { font-size: 12px; color: var(--text-muted); }

.ticket-body { display: flex; justify-content: space-between; align-items: center; }
.preview { font-size: 14px; color: var(--text-muted); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
.badges { display: flex; align-items: center; gap: 8px; }
.unread-badge { background: var(--primary); color: white; border-radius: 12px; padding: 2px 6px; font-size: 12px; font-weight: bold; }
.sla-dot { width: 10px; height: 10px; border-radius: 50%; }
.sla-ok { background: var(--success); }
.sla-warning { background: var(--warning); }
.sla-breached { background: var(--error); }

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #334155;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-panel);
}
.header-info { display: flex; align-items: center; gap: 16px; }
.header-info h2 { margin: 0; }

.message-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-wrapper { display: flex; }
.message-wrapper.inbound { justify-content: flex-start; }
.message-wrapper.outbound { justify-content: flex-end; }

.bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
  font-size: 15px;
  line-height: 1.4;
}
.inbound .bubble { background: #334155; border-bottom-left-radius: 2px; }
.outbound .bubble { background: var(--primary); border-bottom-right-radius: 2px; }

.meta { display: flex; align-items: center; justify-content: flex-end; gap: 4px; margin-top: 4px; font-size: 11px; opacity: 0.8; }
.status-icon { font-size: 14px; width: 14px; height: 14px; }

.input-area {
  padding: 16px;
  background: var(--bg-panel);
  border-top: 1px solid #334155;
  display: flex;
  align-items: center;
  gap: 8px;
}
.input-area textarea {
  flex: 1;
  background: #334155;
  border: none;
  border-radius: 8px;
  padding: 12px;
  color: white;
  resize: none;
  height: 48px;
  font-family: inherit;
  outline: none;
}
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); }
.empty-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.5; }
.typing-indicator { font-size: 12px; color: var(--text-muted); font-style: italic; }
"""

FILES["src/app/features/auth/login/login.component.ts"] = r"""
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
"""

FILES["src/app/app.component.ts"] = r"""
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
"""

for k, v in FILES.items():
    write(k, v)

print("Scaffolding complete.")
