import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleDetail } from '../interfaces/sale/sale-detail';
import { AuthResponse } from '../interfaces/account/auth-response';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  auth = inject(AuthService);

  constructor(private http: HttpClient) { }

  getAllCurrentUserSales=():Observable<SaleDetail[]> => this.getAllSales(this.auth.getUserDetail()?.id);

  getAllSales=(userId: string):Observable<SaleDetail[]> => this.http.get<SaleDetail[]>(`http://localhost:5272/api/sale/getsales?id=${userId}`);

  createSale=(sale: SaleDetail) => this.http.post(`http://localhost:5272/api/sale/createsale`, sale);

  disableSale=(id: string, isActive: boolean):Observable<AuthResponse> => this.http.put<AuthResponse>(`http://localhost:5272/api/Sale/disable/${id}?isActive=${isActive}`, '');

  deleteSale=(id: string):Observable<AuthResponse> => this.http.delete<AuthResponse>(`http://localhost:5272/api/Sale/delete/${id}`);
}
