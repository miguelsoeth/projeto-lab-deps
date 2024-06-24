import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [
    NgxCsvParserModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './upload-csv.component.html',
  styleUrl: './upload-csv.component.css'
})
export class UploadCsvComponent {  
  ngxCsvParser = inject(NgxCsvParser);

  selectedFile: File | null = null;  
  @Output() parsedDocs = new EventEmitter<string[]>();

  onFileSelected(event: any) {
    if (this.isFileCsv(event.target.files[0])) {
      this.selectedFile = event.target.files[0];
      this.parseCsv(event.target.files[0]);
      return
    }
    alert('Arquivo inválido, apenas arquivos CSV!');  
  }

  parseCsv(file: File) {

    this.ngxCsvParser.parse(file, {header: false, delimiter: ',,', encoding: 'utf8' })
      .pipe()
      .subscribe({
        next: (result): void => {
          if (Array.isArray(result)) {
            this.parsedDocs.emit(result.flat());
          }
        },
        error: (error: NgxCSVParserError): void => {
          console.log('Error', error);
        }
      });
  }

  isFileCsv(file: File): boolean {
    if (file && !file.name.toLowerCase().endsWith('.csv')) {
      return false;
    }
    return true;
  }
}
