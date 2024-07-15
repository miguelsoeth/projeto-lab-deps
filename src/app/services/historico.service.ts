import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagina } from '../interfaces/consulta/pagina';
import { HistoricoConsultaLote } from '../interfaces/consulta/historico-consulta-lote';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

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

    return this.http.get<Pagina<HistoricoConsultaLote>>(`${this.apiUrl}dados-publicos`, { params });
  }
}
