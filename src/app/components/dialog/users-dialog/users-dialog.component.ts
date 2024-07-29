import { ProfileService } from '../../../services/profile.service';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { UserDetail } from '../../../interfaces/account/user-detail';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../../services/snackbar.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CreateUserDialogComponent } from '../create-user-dialog/create-user-dialog.component';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { ProfileDetail } from '../../../interfaces/profile/profile-detail';

@Component({
  selector: 'app-users-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatDialogTitle,
    NgIf,
    AsyncPipe,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './users-dialog.component.html',
  styleUrl: './users-dialog.component.css'
})
export class UsersDialogComponent implements OnInit {
  userDetail!: UserDetail;
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  profileService = inject(ProfileService);
  profilesDetail: ProfileDetail[] = [];
  isLoadingResults = true;

  constructor(
    public dialogRef: MatDialogRef<UsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.userDetail = this.data.userDetail;
    this.loadData();
  }

  loadData(): void {
    this.isLoadingResults = true;
    this.profileService.getUserProfiles(this.userDetail.id!).subscribe({
      next: (profiles) => {
        this.profilesDetail = profiles;
        this.isLoadingResults = false;
      }
    });
  }

  deleteProfile(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { action: 'Tem certeza que deseja deletar esse usuário?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profileService.deleteProfile(id).subscribe({
          next: (response) => {
            this.profilesDetail = this.profilesDetail.filter(p => p.id !== id);
            this.snackbar.showMessage("Usuário deletado com sucesso!");
          },
          error: (err) => {
            this.snackbar.showMessage('Erro ao deletar!');
            console.error(err);
          }
        });
      }
    });
  }

  createProfile() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== null && result !== undefined) {
        const profile = {
          profileName: result
        }
        this.profileService.createProfile(this.userDetail.id!, profile).subscribe({
          next: (response) => {
            this.snackbar.showMessage("Usuário adicionado com sucesso!");
            this.loadData();
          },
          error: (err) => {
            this.snackbar.showMessage(err.error.message);
            console.error(err);
          }
        });
      }
    });
  }

  editProfile(profile: ProfileDetail) {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '300px',
      data: { detail: profile }
    });

    dialogRef.afterClosed().subscribe((result: ProfileDetail) => {
      if (result) {
        result.userId = this.userDetail.id;
        this.profileService.editProfile(result).subscribe({
          next: (response) => {
            const profile = this.profilesDetail.find(p => p.id === result.id);
            if (profile) {
              profile.profileName = result.profileName;
            }
            this.snackbar.showMessage("Usuário editado com sucesso!");
          },
          error: (err) => {
            this.snackbar.showMessage(err.error.message);
            console.error(err);
          }
        });
      }
    });
  }

}

