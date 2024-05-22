import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [MatCardModule, CommonModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService);
  accountDetail = this.authService.getDetail();

  getBackgroundColor(fullName: string): string {
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8', '#6610f2',
      '#e83e8c', '#fd7e14', '#6c757d', '#343a40', '#6f42c1', '#20c997'
    ];
    const char = fullName.charAt(0).toUpperCase();
    const index = char.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
