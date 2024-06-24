import { ProfileDetail } from './../../interfaces/profile/profile-detail';
import { UserDetail } from './../../interfaces/account/user-detail';
import { Component, OnInit, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatMenuModule } from '@angular/material/menu'
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';
import { ProfileService } from '../../services/profile.service';
import { Observable, catchError, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { UsersDialogComponent } from '../dialog/users-dialog/users-dialog.component';
import { CreditService } from '../../services/credit.service';
import { CreditDto } from '../../interfaces/credit/credit-detail';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule, 
    RouterLink,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {  
  authService = inject(AuthService);
  router = inject(Router);
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);
  creditsService = inject(CreditService);
  profileService = inject(ProfileService);  

  userDetail$ = this.authService.getDetail();
  credits$ = this.creditsService.getUserCredits(this.authService.getUserDetail()?.id);
  profiles$: Observable<ProfileDetail[]> = this.profileService.getUserProfiles(this.authService.getUserDetail()?.id);

  profileSelected = this.profileService.getProfileKey() ?? 'Selecione o perfil';
  profilesList: ProfileDetail[] = [];

  ngOnInit(): void {
    this.profiles$.subscribe({
      next: (response) => {
        this.profilesList = response;
        const selectedProfile = response.find(profile => profile.profileName === this.profileSelected);
        if (!selectedProfile) {
            this.profileSelected = 'Selecione o perfil';            
            this.profileService.deleteProfileKey();
        }
      }
    })
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  setProfile(name: string) {
    this.profileSelected = name;
    this.profileService.setProfileKey(name);
  }

  openUsersDialog() {
    this.authService.getDetail().subscribe({
      next: (response) => {
        const dialogRef = this.dialog.open(UsersDialogComponent, {
          data: { userDetail: response }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.profiles$ = this.profileService.getUserProfiles(this.authService.getUserDetail()?.id);
          this.profiles$.subscribe({
            next: (response) => {
              this.profilesList = response;
              const selectedProfile = response.find(profile => profile.profileName === this.profileSelected);
              if (!selectedProfile) {
                  this.profileSelected = 'Selecione o perfil';                  
                  this.profileService.deleteProfileKey();
              }
            }
          })
        });
      }
    });    
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  isUser() {
    return this.authService.isUser();
  }

  logout=()=> {
    this.authService.logout();
    this.snackbar.showMessage("Deslogado com sucesso!");
    this.router.navigate(['/login']);
  }
}
