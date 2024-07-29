import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UserDetail } from '../../../interfaces/account/user-detail';
import { MatButtonModule } from '@angular/material/button';
import { UploadCsvComponent } from '../../upload-csv/upload-csv.component';
import { validateCpfCnpj } from '../../../util/validateDocument';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConsultaLoteDto } from '../../../interfaces/consulta/consulta-lote.model';
import { AuthService } from '../../../services/auth.service';
import { ConsultaService } from '../../../services/consulta.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-nova-consulta-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    UploadCsvComponent,
    MatTooltipModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './nova-consulta-lote-dialog.component.html',
  styleUrl: './nova-consulta-lote-dialog.component.css'
})
export class NovaConsultaLoteDialogComponent {
  isLoadingResults = false;

  snackbar = inject(SnackbarService);
  authService = inject(AuthService);
  credit = inject(CreditService);
  consultaService = inject(ConsultaService);

  parsedDocs: string[] = [];
  invalidDocuments: string[] = [];
  cost: number | null = null;

  constructor(public dialogRef: MatDialogRef<NovaConsultaLoteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onParsedDocsReceived(parsedDocs: string[]): void {
    this.parsedDocs = parsedDocs;
    this.invalidDocuments = [];
    this.parsedDocs.forEach(document => {
      var isValid = validateCpfCnpj(document)
      if (!isValid) {
        this.invalidDocuments.push(document);
      }
    });
    this.cost = (this.data.sale.valor * this.parsedDocs.length);
    if (this.invalidDocuments.length > 0) {
      this.snackbar.showMessage(`Documentos inválidos encontrados!`);
    }

  }

  enviarLote(): void {

    if (this.invalidDocuments.length > 0) {
      return
    }
    const selectedProfile = localStorage.getItem('selectedProfile');
    if (!selectedProfile) {
      this.snackbar.showMessage("Selecione o perfil antes de realizar uma pesquisa!");
      return
    }
    this.credit.getCurrentUserCredits().subscribe({
      next: (response) => {
        const credits = response.amount!;
        if (credits < this.cost!) {
          this.snackbar.showMessage("Créditos insuficientes");
          return
        }
      }
    });

    this.isLoadingResults = true;
    const consulta: ConsultaLoteDto = {
      usuario: this.authService.getUserDetail()?.id,
      venda: this.data.sale.saleId,
      documentos: this.parsedDocs,
      perfil: selectedProfile
    }
    this.consultaService.postConsultaLote(consulta).subscribe({
      next: (response) => {
        this.snackbar.showMessage(response.message);
        this.isLoadingResults = false;
        this.dialogRef.close();
        if (response.success) {
          this.credit.decreaseCreditFront(this.cost!);
        }
      }
    });

  }

}
