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

@Component({
  selector: 'app-consulta-online',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    CommonModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule
  ],
  templateUrl: './consulta-online.component.html',
  providers: [provideNgxMask()],
  styleUrl: './consulta-online.component.css'
})
export class ConsultaOnlineComponent {
  authService = inject(AuthService);
  snackbar = inject(SnackbarService);
  saleService = inject(SaleService);
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
    
    const obj = {
      venda: this.saleControl.value?.saleId,
      documento: this.documentControl.value,
      perfil: localStorage.getItem('selectedProfile')
    }
    console.log(obj);
  }
}
