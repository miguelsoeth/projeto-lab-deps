import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, map } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { EditRequest } from '../interfaces/edit-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = environment.apiUrl;
  private userKey = 'user';  

  constructor(private http: HttpClient) { }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}Account/login`, data)
      .pipe(
        map((response) => {
          if (response.isSuccess) {
            localStorage.setItem(this.userKey, JSON.stringify(response));
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

  getIdDetail=(id: string):Observable<UserDetail> => {
    return this.http.get<UserDetail>(`${this.apiUrl}account/detail/${id}`);
  }

  editUser=(user: EditRequest, id: string): Observable<AuthResponse> => {
    return this.http.put<AuthResponse>(`${this.apiUrl}account/edit/${id}`, user);
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
    //return !this.isTokenExpired();
    return true;
  }


  private isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000;
    if (isTokenExpired) this.logout();
    //return isTokenExpired;
    return true;
  }

  logout=():void => {
    localStorage.removeItem(this.userKey);
  }

  getToken = ():string|null => {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    const userDetail:AuthResponse=JSON.parse(user);
    return userDetail.token;
  }

  getRefreshToken = ():string|null => {
    const user = localStorage.getItem(this.userKey);
    if (!user) return null;
    const userDetail:AuthResponse=JSON.parse(user);
    return userDetail.refreshToken;
  }

  getRoles = ():string | null => {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = jwtDecode(token);
    return decodedToken.role || null;
  }

  getAllClients=():Observable<UserDetail[]> => this.http.get<UserDetail[]>(`${this.apiUrl}account`)

  refreshToken=(data:{email: string, token: string, refreshToken: string}) : Observable<AuthResponse> =>
    this.http.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data);

}
