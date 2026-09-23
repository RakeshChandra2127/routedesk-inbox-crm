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
