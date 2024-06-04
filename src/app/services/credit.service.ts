import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditDto } from '../interfaces/credit/credit-detail';
import { AuthResponse } from '../interfaces/account/auth-response';

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  apiUrl: string = environment.apiUrl;
  private userKey = 'user';  

  constructor(private http: HttpClient) { }

  getUserCredits(userId: string):Observable<CreditDto> {
    return this.http.get<CreditDto>(`${this.apiUrl}credits/get/${userId}`);
  }

  increaseUserCredits(userId: string, amount: number):Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}credits/increase/${userId}?amount=${amount}`, {});
  }

  decreaseUserCredits(userId: string, amount: number):Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}credits/decrease/${userId}?amount=${amount}`, {});
  }
}
