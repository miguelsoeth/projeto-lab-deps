import { Component, Inject, OnInit, inject } from '@angular/core';
import { SnackbarService } from '../../../services/snackbar.service';
import { UserDetail } from '../../../interfaces/account/user-detail';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-credits-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogTitle,
    NgIf,
    AsyncPipe,
    MatIconModule,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    CommonModule
  ],
  templateUrl: './credits-dialog.component.html',
  providers: [provideNgxMask()],
  styleUrl: './credits-dialog.component.css'
})
export class CreditsDialogComponent implements OnInit {
  userDetail!: UserDetail;
  snackbar = inject(SnackbarService);
  credit = inject(CreditService);
  dialog = inject(MatDialog);
  isLoadingResults = true;

  credits: number = 0;
  showCredits: number = this.credits;

  constructor(
    public dialogRef: MatDialogRef<CreditsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.userDetail = this.data.userDetail;
    this.loadData();
  }

  loadData(): void {
    this.isLoadingResults = false;
    this.credit.getUserCredits(this.userDetail.id!).subscribe({
      next: (response) => {        
        this.credits = response.amount!;
        this.changeCredits(this.credits);
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.showMessage(err.error.message);
      }
    });
  }

  changeCredits(value: number): void {
    this.showCredits = value;
  }

  saveCredits(): void {
    const value = this.credits - (this.showCredits);
    if (value > 0) {
      this.credits = this.credits - Math.abs(value);
      this.credit.decreaseCreditApi(this.userDetail.id!, Math.abs(value)).subscribe();
    }
    else {
      this.credits = this.credits + Math.abs(value);
      this.credit.increaseCreditApi(this.userDetail.id!, Math.abs(value)).subscribe();
    }
    this.changeCredits(this.credits);
    this.snackbar.showMessage(`Créditos de ${this.userDetail.name} atualizado para R$ ${this.credits.toFixed(2)}`);
  }

  confirmCreditsChange(): void {
    if (this.credits == this.showCredits) {
      this.snackbar.showMessage("Valor inicial não alterado.");
      return
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { action: 'Tem certeza que deseja alterar o cŕedito desse usuário?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveCredits();
      }
    });
  }

}