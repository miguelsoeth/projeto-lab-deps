import { SaleDetail } from './../../../interfaces/sale/sale-detail';
import { SaleService } from './../../../services/sale.service';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ProductDetail } from './../../../interfaces/product/product-detail';
import { Observable } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { UserDetail } from '../../../interfaces/account/user-detail';

@Component({
  selector: 'app-create-product-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
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
  templateUrl: './create-product-dialog.component.html',
  providers: [provideNgxMask()],
  styleUrls: ['./create-product-dialog.component.css']
})
export class CreateProductDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CreateProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  productService = inject(ProductService);
  saleService = inject(SaleService);
  userDetail!: UserDetail;
  fb = inject(FormBuilder);
  products$: Observable<ProductDetail[]> = this.productService.getAllProducts();
  form!: FormGroup;
  produtoControl = new FormControl<ProductDetail | null>(null, Validators.required);

  ngOnInit(): void {
    this.userDetail = this.data.userDetail;
    this.initializeForm();
  }

  initializeForm(): void {    
    this.form = this.fb.group({
      produtos: this.produtoControl,
      valor: ['', [Validators.required]],
    });
  }

  enviar(): void {
    if (this.form.valid) {
      const obj:SaleDetail = {
        userId: this.userDetail.id,
        productId: this.form.value.produtos.id,
        valor: this.form.value.valor,
        productName: '',
        productDescription: ''
      }
      this.saleService.createSale(obj).subscribe({
        next: (response) => {
          return this.dialogRef.close(response);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
