import { Component, Input, inject, input } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UsersDialogComponent } from '../dialog/users-dialog/users-dialog.component';
import { UserDetail } from '../../interfaces/account/user-detail';

@Component({
  selector: 'app-options-button',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './options-button.component.html',
  styleUrl: './options-button.component.css'
})
export class OptionsButtonComponent {
  @Input() userDetail!: UserDetail; 
  dialog = inject(MatDialog)

  openUsersDialog() {
    const dialogRef = this.dialog.open(UsersDialogComponent, {
      data: { userDetail: this.userDetail }
    });
  }
}
