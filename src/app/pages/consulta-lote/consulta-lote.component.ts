import { MatButtonModule } from '@angular/material/button';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UploadCsvComponent } from '../../components/upload-csv/upload-csv.component';
import { MatDialog } from '@angular/material/dialog';
import { NovaConsultaLoteDialogComponent } from '../../components/dialog/nova-consulta-lote-dialog/nova-consulta-lote-dialog.component';
import { AuthService } from '../../services/auth.service';
import { SaleService } from '../../services/sale.service';
import { Observable, catchError, map, merge, startWith, switchMap, of as observableOf } from 'rxjs';
import { SaleDetail } from '../../interfaces/sale/sale-detail';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDetail } from '../../interfaces/product/product-detail';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoricoService } from '../../services/historico.service';
import { HistoricoConsultaLote } from '../../interfaces/consulta/historico-consulta-lote';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-consulta-lote',
  standalone: true,
  imports: [
    MatCardModule, 
    MatButtonModule, 
    UploadCsvComponent,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatIconModule
  ],
  templateUrl: './consulta-lote.component.html',
  styleUrl: './consulta-lote.component.css'
})
export class ConsultaLoteComponent implements AfterViewInit {  
  auth = inject(AuthService)
  dialog = inject(MatDialog)
  historico = inject(HistoricoService)
  snackbar = inject(SnackbarService);

  saleService = inject(SaleService);
  sales$: Observable<SaleDetail[]> = this.saleService.getAllCurrentUserSales();

  fb = inject(FormBuilder);
  saleControl = new FormControl<SaleDetail | null>(null, Validators.required);
  form: FormGroup = this.fb.group({
    venda: this.saleControl
  });;


  displayedColumns: string[] = ['registerDate', 'profile', 'startDate', 'endDate', 'quantity', 'status'];
  data: HistoricoConsultaLote[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {    
    this.fetchData();
  }

  fetchData() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.historico.getHistoricoConsultaLote(
            this.paginator.pageIndex+1,
            this.paginator.pageSize
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
        console.log(this.data);
      });
  }

  openNovaConsultaDialog(sale: SaleDetail) {
    const selectedProfile = localStorage.getItem('selectedProfile');
    if (!selectedProfile) {
      this.snackbar.showMessage("Selecione o perfil antes de realizar uma pesquisa!");
      return
    }
    const dialogRef = this.dialog.open(NovaConsultaLoteDialogComponent, {
      data: { 
        userDetail: this.auth.getUserDetail(),
        sale: sale
      }
    });
  }

  refreshLotes() {
    this.fetchData();
  }

}


// this.historico.getHistoricoConsultaLote(1, 5).subscribe({
//   next: (response) => {
//     console.log("Response: ", response);
//   }
// });
