import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfileDetail } from '../../../interfaces/profile/profile-detail';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogTitle,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent {
  name: string = this.data.detail.name;

  constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  Confirm(): void {
    const detail: ProfileDetail = {
      id: this.data.detail.id,
      profileName: this.name
    }
    this.dialogRef.close(detail);
  }

  Cancel(): void {
    this.dialogRef.close(null);
  }
}
