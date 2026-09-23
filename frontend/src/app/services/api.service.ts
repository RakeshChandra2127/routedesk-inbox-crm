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
