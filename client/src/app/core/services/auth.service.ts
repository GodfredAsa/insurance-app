import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const API = `${environment.apiUrl}/api/v1`;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserResponse {
  id: number | null;
  email: string;
  name: string;
  role: string;
  created_at: string | null;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

const TOKEN_KEY = 'ifrs17_access_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSignal = signal<UserResponse | null>(null);
  private tokenSignal = signal<string | null>(this.getStoredToken());

  currentUser = this.currentUserSignal.asReadonly();
  token = this.tokenSignal.asReadonly();
  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor() {
    const tok = this.tokenSignal();
    if (tok) {
      this.fetchCurrentUser().subscribe();
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.tokenSignal.set(token);
  }

  private getUserIdFromToken(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      const sub = payload?.sub;
      return sub != null ? +sub : null;
    } catch {
      return null;
    }
  }

  private fetchCurrentUser(): Observable<UserResponse | null> {
    const token = this.tokenSignal();
    if (!token) return of(null);
    const userId = this.getUserIdFromToken(token);
    if (userId == null) return of(null);

    return this.http.get<UserResponse>(`${API}/users/${userId}`).pipe(
      tap((user) => this.currentUserSignal.set(user)),
      catchError(() => {
        this.logout();
        return of(null);
      })
    );
  }

  login(email: string, password: string): Observable<{ success: boolean; error?: string }> {
    return this.http.post<TokenResponse>(`${API}/login`, { email, password }).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.fetchCurrentUser().subscribe();
      }),
      map(() => ({ success: true })),
      catchError((err) => {
        const d = err?.error?.detail;
        let msg = 'Login failed. Please try again.';
        if (d === 'Invalid email or password') msg = 'Invalid email or password.';
        else if (typeof d === 'string') msg = d;
        else if (Array.isArray(d) && d.length) msg = d[0]?.msg ?? msg;
        else if (err?.status === 0) msg = 'Unable to connect. Please check your network.';
        return of({ success: false, error: msg });
      })
    );
  }

  register(data: RegisterRequest): Observable<{ success: boolean; error?: string }> {
    return this.http.post<UserResponse>(`${API}/register`, data, { observe: 'response' }).pipe(
      switchMap((res) => {
        if (res.status === 201) {
          return this.login(data.email, data.password);
        }
        return of({ success: false, error: 'Registration failed.' });
      }),
      catchError((err) => {
        const d = err?.error?.detail;
        let msg = 'Registration failed. Please try again.';
        if (typeof d === 'string') {
          msg = d;
          if (d.includes('already') || d.includes('registered')) msg = 'Email already registered.';
        } else if (Array.isArray(d) && d.length) {
          msg = d[0]?.msg ?? msg;
        } else if (err?.status === 0) {
          msg = 'Unable to connect. Please check your network.';
        }
        return of({ success: false, error: msg });
      })
    );
  }

  logout(): void {
    this.setToken(null);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
