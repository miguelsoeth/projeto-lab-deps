import { SaleDetail } from './../../../interfaces/sale/sale-detail';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserDetail } from '../../../interfaces/account/user-detail';
import { SnackbarService } from '../../../services/snackbar.service';
import { ProductService } from '../../../services/product.service';
import { ProductDetail } from '../../../interfaces/product/product-detail';
import { UsersDialogComponent } from '../users-dialog/users-dialog.component';
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component';
import { SaleService } from '../../../services/sale.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogTitle,
    NgIf,
    AsyncPipe,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    CurrencyPipe
  ],
  templateUrl: './product-dialog.component.html',
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  styleUrl: './product-dialog.component.css'
})
export class ProductDialogComponent implements OnInit {
  userDetail!: UserDetail;
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  sale = inject(SaleService);
  sales: SaleDetail[] = [];

  isLoadingResults = false;

  constructor(
    public dialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.userDetail = this.data.userDetail;
    this.loadSales();
  }

  addProduct() {
    const dialogRef = this.dialog.open(CreateProductDialogComponent, {
      data: { userDetail: this.userDetail }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackbar.showMessage(result.message);
        this.loadSales();
      }
    });
  }

  loadSales(): void {
    this.sale.getAllSales(this.userDetail.id!).subscribe({
      next: (response) => {
        this.sales = response;
      },
      error: (err) => {
        this.snackbar.showMessage(err.error.message);
        console.error(err);
      }
    });
  }

  onToggleChange(event: any, saleId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { action: 'Tem certeza que deseja alterar esse produto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sale.disableSale(saleId, event.checked).subscribe({
          next: (response) => {
            this.snackbar.showMessage(response.message);
          }
        });
      }
      else {
        event.source.checked = !event.checked;
      }
    });

  }

  deleteProduct(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { action: 'Tem certeza que deseja deletar esse produto?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.sale.deleteSale(id).subscribe({
          next: (response) => {
            this.snackbar.showMessage(response.message);
            this.loadSales();
          },
          error: (err) => {
            this.snackbar.showMessage(err.error.message);
          }
        });
      }
    });

  }

}
