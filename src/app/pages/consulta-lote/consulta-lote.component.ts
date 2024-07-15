import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UploadCsvComponent } from '../../components/upload-csv/upload-csv.component';
import { MatDialog } from '@angular/material/dialog';
import { NovaConsultaLoteDialogComponent } from '../../components/dialog/nova-consulta-lote-dialog/nova-consulta-lote-dialog.component';
import { AuthService } from '../../services/auth.service';
import { SaleService } from '../../services/sale.service';
import { Observable } from 'rxjs';
import { SaleDetail } from '../../interfaces/sale/sale-detail';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDetail } from '../../interfaces/product/product-detail';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { HistoricoService } from '../../services/historico.service';

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
    MatFormFieldModule
  ],
  templateUrl: './consulta-lote.component.html',
  styleUrl: './consulta-lote.component.css'
})
export class ConsultaLoteComponent implements OnInit {  
  auth = inject(AuthService)
  dialog = inject(MatDialog)
  historico = inject(HistoricoService)

  saleService = inject(SaleService);
  sales$: Observable<SaleDetail[]> = this.saleService.getAllCurrentUserSales();

  fb = inject(FormBuilder);
  saleControl = new FormControl<SaleDetail | null>(null, Validators.required);
  form: FormGroup = this.fb.group({
    venda: this.saleControl
  });;

  ngOnInit(): void {
    this.historico.getHistoricoConsultaLote(1, 5).subscribe({
      next: (response) => {
        console.log("Response: ", response);
      }
    });
  }

  openNovaConsultaDialog(sale: SaleDetail) {
    const dialogRef = this.dialog.open(NovaConsultaLoteDialogComponent, {
      data: { 
        userDetail: this.auth.getUserDetail(),
        sale: sale
      }
    });
  }

}
