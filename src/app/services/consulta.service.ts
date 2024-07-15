import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { AuthResponse } from '../interfaces/account/auth-response';
import { Observable } from 'rxjs';
import { ConsultaOnlineDto } from '../interfaces/consulta/consulta-online.model';
import { ConsultaResultado } from '../interfaces/consulta/consulta-resultado';
import { ConsultaLoteDto } from '../interfaces/consulta/consulta-lote.model';
import { HistoricoConsultaLote } from '../interfaces/consulta/historico-consulta-lote';
import { Pagina } from '../interfaces/consulta/pagina';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  postConsultaOnline(consulta: ConsultaOnlineDto):Observable<ConsultaResultado> {
    return this.http.post<ConsultaResultado>(`${this.apiUrl}consulta/online`, consulta);
  }

  postConsultaLote(consulta: ConsultaLoteDto):Observable<ConsultaResultado> {
    return this.http.post<ConsultaResultado>(`${this.apiUrl}consulta/lote`, consulta);
  }
  
}
