import { MatButtonModule } from '@angular/material/button';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UploadCsvComponent } from '../../components/upload-csv/upload-csv.component';
import { MatDialog } from '@angular/material/dialog';
import { NovaConsultaLoteComponent } from '../../components/dialog/nova-consulta-lote/nova-consulta-lote.component';
import { AuthService } from '../../services/auth.service';
import { SaleService } from '../../services/sale.service';
import { Observable } from 'rxjs';
import { SaleDetail } from '../../interfaces/sale/sale-detail';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductDetail } from '../../interfaces/product/product-detail';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

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
export class ConsultaLoteComponent {
  auth = inject(AuthService)
  dialog = inject(MatDialog)

  saleService = inject(SaleService);
  sales$: Observable<SaleDetail[]> = this.saleService.getAllCurrentUserSales();

  fb = inject(FormBuilder);
  saleControl = new FormControl<SaleDetail | null>(null, Validators.required);
  form: FormGroup = this.fb.group({
    venda: this.saleControl
  });;

  openNovaConsultaDialog(sale: SaleDetail) {
    const dialogRef = this.dialog.open(NovaConsultaLoteComponent, {
      data: { 
        userDetail: this.auth.getUserDetail(),
        sale: sale
      }
    });
  }

}
