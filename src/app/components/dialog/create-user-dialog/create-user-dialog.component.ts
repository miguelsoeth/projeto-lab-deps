import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-create-user-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogTitle,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.css'
})
export class CreateUserDialogComponent {

  name!: string;

  constructor(public dialogRef: MatDialogRef<CreateUserDialogComponent>) {}

  Confirm(): void {
    this.dialogRef.close(this.name);
  }

  Cancel(): void {
    this.dialogRef.close(null);
  }

}
