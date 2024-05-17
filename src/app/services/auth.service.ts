import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private tokenKey = 'token';  

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}Account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.tokenKey, response.token);
          }
          return response;
        })
      );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}Account/register`, data);
  }

  isAdmin=() => {
    const userDetail = this.getUserDetail();
    if (userDetail?.roles.includes("Admin")) {
      return true;
    }
    return false;
  }

  isUser=() => {
    const userDetail = this.getUserDetail();
    if (userDetail?.roles.includes("User")) {
      return true;
    }
    return false;
  }

  getDetail=():Observable<UserDetail> => {
    return this.http.get<UserDetail>(`${this.apiUrl}account/detail`);
  }

  getUserDetail=() => {
    const token = this.getToken();
    
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    const userDetail = {
      id:decodedToken.nameid,
      fullName:decodedToken.name,
      email: decodedToken.email,
      roles:decodedToken.role || [],
    }

    return userDetail;
  }

  isLoggedIn = ():boolean=> {
    const token = this.getToken();
    if(!token) return false;
    return !this.isTokenExpired();
  }


  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout=():void => {
    localStorage.removeItem(this.tokenKey);
  }

  getToken = ():string|null => localStorage.getItem(this.tokenKey) || '';

  getRoles = ():string | null => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }

  getAllClients=():Observable<UserDetail[]> => this.http.get<UserDetail[]>(`${this.apiUrl}account`)

}
