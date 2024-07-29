import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HistoricoService } from '../../services/historico.service';
import { ResultData } from '../../interfaces/consulta/consulta-resultado';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-visualizar-consulta',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  templateUrl: './visualizar-consulta.component.html',
  providers: [provideNgxMask()],
  styleUrl: './visualizar-consulta.component.css'
})
export class VisualizarConsultaComponent implements OnInit {
  isLoadingResults = true;
  id!: string | null;
  data!: ResultData;
  isSuccess?: boolean;
  route = inject(ActivatedRoute);
  historico = inject(HistoricoService)

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');

      if (this.id != null) {
        this.historico.getConsulta(this.id).subscribe(res => {
          this.data = res.data;
          this.isSuccess = res.success;
          this.isLoadingResults = false;
        });
      } else {

      }
    });
  }
}
