import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleDetail } from '../interfaces/sale/sale-detail';
import { AuthResponse } from '../interfaces/account/auth-response';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl: string = environment.apiUrl;
  auth = inject(AuthService);

  constructor(private http: HttpClient) { }

  getAllCurrentUserSales=():Observable<SaleDetail[]> => this.getAllSales(this.auth.getUserDetail()?.id);

  getAllSales=(userId: string):Observable<SaleDetail[]> => this.http.get<SaleDetail[]>(`${this.apiUrl}sale/getsales?id=${userId}`);

  createSale=(sale: SaleDetail) => this.http.post(`${this.apiUrl}sale/createsale`, sale);

  disableSale=(id: string, isActive: boolean):Observable<AuthResponse> => this.http.put<AuthResponse>(`${this.apiUrl}Sale/disable/${id}?isActive=${isActive}`, '');

  deleteSale=(id: string):Observable<AuthResponse> => this.http.delete<AuthResponse>(`${this.apiUrl}Sale/delete/${id}`);
}
