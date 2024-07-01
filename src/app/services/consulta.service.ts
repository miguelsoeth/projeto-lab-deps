import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthResponse } from '../interfaces/account/auth-response';
import { Observable } from 'rxjs';
import { ConsultaOnlineDto } from '../interfaces/consulta/consulta-online.model';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  postConsultaOnline(consulta: ConsultaOnlineDto):Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}consulta/online`, consulta);
  }
  
}
