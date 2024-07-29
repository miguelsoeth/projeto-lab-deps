//Angular
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner'; 
//Services
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { CreditService } from '../../services/credit.service';
import { MatDialog } from '@angular/material/dialog';
import { UsersDialogComponent } from '../../components/dialog/users-dialog/users-dialog.component';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatButtonModule, ReactiveFormsModule, NgIf, RouterLink, MatIconModule, MatProgressSpinner],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  //Injects
  router = inject(Router);
  credit = inject(CreditService);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackBar = inject(SnackbarService);

  hide = true;
  isLoadingResults = false;
  form!: FormGroup;  
  
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submit() {
    this.isLoadingResults = true;
    this.authService.login(this.form.value).subscribe({      
      next: (response) => {
        this.snackBar.showMessage(response.message);        
        if (this.authService.isUser()) {
          this.credit.fetch();
        }  
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.snackBar.showMessage(error.error.message);
        this.isLoadingResults = false;     
      }
    });
  }

}
