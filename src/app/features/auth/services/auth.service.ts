import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { LoginResult, UserAuthData } from '../auth.model';
import { API_BASE_ROUTE } from '@@core/core.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiBaseUrl: string;
  isAuthenticate$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    if (this.isAuthenticated()) {
      this.isAuthenticate$.next(true)
    }

    this.apiBaseUrl = API_BASE_ROUTE;
  }

  async login(userName: string, password: string): Promise<LoginResult> {
    const url = `${this.apiBaseUrl}token/login`;
    const body = { userName, password };
    const loginResponse: any = await this.http.post(url, body).toPromise();

    const now = new Date();
    now.setSeconds(now.getSeconds() + loginResponse.expiryInSeconds);

    loginResponse.expiryInSeconds = now;
    this.saveUserFullData(loginResponse);
    this.isAuthenticate$.next(true);

    return this.mapToLoginResult(loginResponse, true, null);
  }

  logout() {
    this.removeUserFullData();
    this.router.navigateByUrl('/login');
  }

  saveUserFullData(response: any) {
    localStorage.setItem('userName', response.userName);
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    localStorage.setItem('auth-token-expiry', response.expiryInSeconds);
    localStorage.setItem('result', response.result);
  }

  removeUserFullData() {
    localStorage.removeItem('userName');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth-token-expiry');
    localStorage.removeItem('result');
    this.isAuthenticate$.next(false);
  }

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }

  isTokenExpired(): boolean {
    const currentTime = new Date().getTime();

    if (localStorage.getItem('auth-token-expiry') === null) {
      return true;
    }

    const expiryTime = new Date(localStorage.getItem('auth-token-expiry')).getTime();
    return currentTime > expiryTime;
  }

  getToken(): string {
    return localStorage.getItem('accessToken');
  }

  private mapToLoginResult(userData: UserAuthData, success: boolean, message: any): LoginResult {
    return {
      success,
      userData,
      message
    };
  }

}
