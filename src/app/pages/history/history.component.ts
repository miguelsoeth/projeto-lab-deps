import { HistoricoConsulta } from './../../interfaces/consulta/historico-consulta';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HistoricoService } from '../../services/historico.service';
import { Observable, catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    NgxMaskDirective,
    NgxMaskPipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './history.component.html',
  providers: [provideNgxMask()],
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewInit {
  form!: FormGroup;
  cliente?: string
  documento?: string
  authService = inject(AuthService)

  historico = inject(HistoricoService);
  displayedColumns: string[] = ['Date', 'Cnpj', 'RazaoSocial', 'opcoes'];
  data: HistoricoConsulta[] = [];
  isLoadingResults = true;
  resultsLength = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.fetchData();
  }

  filtrar(cliente?: string, documento?: string) {
    if (documento) {
      documento = documento.replace(/[^\d]/g, '');
    }
    this.paginator.pageIndex = 0;
    this.cliente = cliente;
    this.documento = documento;
    this.fetchData();

  }

  fetchData() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.historico.getHistoricoConsulta(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            this.cliente,
            this.documento
          ).pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }
          this.resultsLength = data.totalCount;
          return data.items;
        }),
      )
      .subscribe(data => {
        this.data = data;
      });
  }

  isAdmin() {
    const res = this.authService.isAdmin()
    if (res) {
      this.displayedColumns = ['Date', 'Cnpj', 'RazaoSocial', 'usuario', 'opcoes'];
    }
    return res;
  }

}
