import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SaleDetail } from '../interfaces/sale/sale-detail';
import { AuthResponse } from '../interfaces/account/auth-response';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(private http: HttpClient) { }

  getAllSales=(userId: string):Observable<SaleDetail[]> => this.http.get<SaleDetail[]>(`http://localhost:5272/api/sale/getsales?id=${userId}`);

  createSale=(sale: SaleDetail) => this.http.post(`http://localhost:5272/api/sale/createsale`, sale);

  disableSale=(id: string, isActive: boolean):Observable<AuthResponse> => this.http.put<AuthResponse>(`http://localhost:5272/api/Sale/disable/${id}?isActive=${isActive}`, '');
}
