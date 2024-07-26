import { CreditService } from '../../services/credit.service';
import { AuthService } from './../../services/auth.service';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { ProductDetail } from '../../interfaces/product/product-detail';
import { ProductService } from '../../services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { cpfCnpjFormValidator } from '../../util/validateDocument';
import { SaleDetail } from '../../interfaces/sale/sale-detail';
import { SaleService } from '../../services/sale.service';
import { environment } from '../../../environments/environment.development';
import { SnackbarService } from '../../services/snackbar.service';
import { ConsultaOnlineDto } from '../../interfaces/consulta/consulta-online.model';
import { ConsultaService } from '../../services/consulta.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Pagina } from '../../interfaces/consulta/pagina';
import { DadosItem } from '../../interfaces/consulta/consulta-resultado2';
import { ConsultaResultado } from '../../interfaces/consulta/consulta-resultado';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-consulta-online',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './consulta-online.component.html',
  providers: [provideNgxMask()],
  styleUrl: './consulta-online.component.css'
})
export class ConsultaOnlineComponent {
  isLoadingResults = false;
  result?: ConsultaResultado;

  authService = inject(AuthService);
  credit = inject(CreditService);
  snackbar = inject(SnackbarService);
  saleService = inject(SaleService);
  consultaService = inject(ConsultaService);
  sales$: Observable<SaleDetail[]> = this.saleService.getAllSales(this.authService.getUserDetail()?.id);
  
  fb = inject(FormBuilder);
  saleControl = new FormControl<SaleDetail | null>(null, Validators.required);
  documentControl = new FormControl<string | null>(null, [Validators.required, cpfCnpjFormValidator()]);
  form: FormGroup = this.fb.group({
    venda: this.saleControl,
    documento: this.documentControl,
  });

  consultar(): void {
    const perfil = localStorage.getItem('selectedProfile');
    if (!perfil) {
      this.snackbar.showMessage("Selecione o perfil antes de realizar uma pesquisa!");
      return
    }
    
    const consulta: ConsultaOnlineDto = {
      usuario: this.authService.getUserDetail()?.id,
      venda: this.saleControl.value?.saleId!,
      documento: this.documentControl.value!,
      perfil: localStorage.getItem('selectedProfile')!
    }
    this.isLoadingResults = true;
    this.consultaService.postConsultaOnline(consulta).subscribe({
      next: (response) => {
        this.isLoadingResults = false;
        this.result = response;
        if (this.result.success) {
          this.credit.decreaseCreditFront(this.saleControl.value?.valor!);
        }
        console.log("Result: ", response);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.showMessage(err.error.message);
        this.isLoadingResults = false;
      }
    });
  }
}
