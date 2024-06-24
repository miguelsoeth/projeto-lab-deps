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
import { CreditService } from '../../../services/credit.service';

@Component({
  selector: 'app-nova-consulta',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    UploadCsvComponent, 
    MatTooltipModule, 
    CommonModule, 
    MatIconModule
  ],
  templateUrl: './nova-consulta-lote.component.html',
  styleUrl: './nova-consulta-lote.component.css'
})
export class NovaConsultaLoteComponent {
  snackbar = inject(SnackbarService);
  credits = inject(CreditService);  

  parsedDocs: string[] = [];
  invalidDocuments: string[] = [];
  cost: number | null = null;

  constructor(public dialogRef: MatDialogRef<NovaConsultaLoteComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    //console.log(this.data);
  }

  onParsedDocsReceived(parsedDocs: string[]): void {
    this.parsedDocs = parsedDocs;
    this.invalidDocuments = [];
    this.parsedDocs.forEach(document => {
      var isValid = validateCpfCnpj(document)
      if (!isValid) {
        this.invalidDocuments.push(document);
      }
    });
    this.cost = (this.data.sale.valor*this.parsedDocs.length);
    if (this.invalidDocuments.length > 0) {
      this.snackbar.showMessage(`Documentos inválidos encontrados!`);
    }
    
  }

  enviarLote(): void {
    if (this.invalidDocuments.length > 0) {
      console.log("documentos inválidos presentes")
      return
    }
    const selectedProfile = localStorage.getItem('selectedProfile');
    if (!selectedProfile) {
      this.snackbar.showMessage("Selecione o perfil antes de realizar uma pesquisa!");
      return
    }
    this.credits.getCurrentUserCredits().subscribe({
      next: (response) => {
        const credits = response.amount!;
        if (credits < this.cost!) {
          this.snackbar.showMessage("Cŕeditos insuficientes");
          return
        }               
      }
    });
    
    console.log("Enviar pedido em lote");        
    const obj = {
      venda: this.data.sale.saleId,
      documentos: this.parsedDocs,
      perfil: selectedProfile
    }
    console.log(obj);
  }

}
