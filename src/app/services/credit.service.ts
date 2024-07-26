import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreditDto } from '../interfaces/credit/credit-detail';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth.service';
import { AuthResponse } from '../interfaces/account/auth-response';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  apiUrl: string = environment.apiUrl;
  auth = inject(AuthService);

  private _creditData = new BehaviorSubject<CreditDto>({
    userId: '',
    amount: 0,
    message: ''
  })

  currentCredit = this._creditData.asObservable();

  constructor(private http: HttpClient) { 
    this.fetch();
  }

  fetch(): void {
    this.getCurrentUserCredits().subscribe({
      next: (response) => {
        this._creditData.next(response);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getCurrentUserCredits():Observable<CreditDto> {    
    return this.getUserCredits(this.auth.getUserDetail()?.id);
  }

  getUserCredits(userId: string):Observable<CreditDto> {
    return this.http.get<CreditDto>(`${this.apiUrl}credits/get/${userId}`);
  }

  increaseCreditFront(amount: number) {
    const current = this._creditData.value;
    current.amount! += amount;
    this._creditData.next(current);
  }

  decreaseCreditFront(amount: number) {
    const current = this._creditData.value;
    current.amount! -= amount;
    this._creditData.next(current);
  }

  increaseCreditApi(userId: string, amount: number):Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}credits/increase/${userId}?amount=${amount}`, {});
  }

  decreaseCreditApi(userId: string, amount: number):Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}credits/decrease/${userId}?amount=${amount}`, {});
  }
}
