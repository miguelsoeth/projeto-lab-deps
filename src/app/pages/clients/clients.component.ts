import { OptionsButtonComponent } from './../../components/options-button/options-button.component';
import { Observable, of as observableOf, timer } from 'rxjs';
import { AfterViewInit, Component, ViewChild, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserDetail } from '../../interfaces/account/user-detail';
import { AsyncPipe, NgIf } from '@angular/common';
import { catchError, map } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgIf,
    AsyncPipe,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule,
    NgxMaskDirective,
    NgxMaskPipe,
    OptionsButtonComponent,
    MatSlideToggleModule
  ],
  providers: [provideNgxMask()],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements AfterViewInit {
  authService = inject(AuthService);

  displayedColumns: string[] = ['document','name', 'options'];
  dataSource: MatTableDataSource<UserDetail> = new MatTableDataSource();
  data: UserDetail[] = [];
  isLoadingResults = true;
  isError = false;
  resultsLength = 0;
  showDisabledUsers = true;
  allUsers: UserDetail[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.loadData();
  }

  loadData() {
    this.authService.getAllClients().pipe(
      catchError(() => {
        this.isError = true;
        this.isLoadingResults = false;
        return observableOf([]);
      }),
      map(data => {
        this.isLoadingResults = false;
        return data || [];
      })
    ).subscribe(data => {
      this.dataSource.data = data;
      this.resultsLength = data.length;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onToggleChange(event: any): void {
    this.showDisabledUsers = event.checked;
    console.log('Show disabled users:', this.showDisabledUsers);
    if (!this.showDisabledUsers) {
      this.allUsers = this.dataSource.data;
      this.dataSource.data = this.dataSource.data.filter(user => user.isActive == true);
    } else {
        this.dataSource.data = this.allUsers;
    }
    this.resultsLength = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
