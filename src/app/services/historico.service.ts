import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagina } from '../interfaces/consulta/pagina';
import { HistoricoConsultaLote } from '../interfaces/consulta/historico-consulta-lote';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { HistoricoConsulta } from '../interfaces/consulta/historico-consulta';
import { ConsultaResultado, ResultData } from '../interfaces/consulta/consulta-resultado';

@Injectable({
  providedIn: 'root'
})
export class HistoricoService {

  private readonly apiUrl: string = environment.historicoUrl;

  constructor(private http: HttpClient) { }

  getHistoricoConsultaLote(pageNumber: number, pageSize: number): Observable<Pagina<HistoricoConsultaLote>> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<Pagina<HistoricoConsultaLote>>(`${this.apiUrl}dados-publicos/historico/lote`, { params });
  }

  getHistoricoConsulta(pageNumber: number, pageSize: number, cliente?: string, documento?: string): Observable<Pagina<HistoricoConsulta>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (cliente) {
      params = params.set('client', cliente);
    }
    if (documento) {
      params = params.set('document', documento);
    }

    return this.http.get<Pagina<HistoricoConsulta>>(`${this.apiUrl}dados-publicos/historico/`, { params });
  }

  getConsulta(id: string): Observable<ConsultaResultado> {
    const params = new HttpParams()
      .set('id', id)

    return this.http.get<ConsultaResultado>(`${this.apiUrl}dados-publicos/visualizar/`, { params });
  }
}
