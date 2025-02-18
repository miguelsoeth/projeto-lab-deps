import { UserDetail } from './../../interfaces/account/user-detail';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
// Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
// Services
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/account/validation-error';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, RouterLink, NgIf, MatSelectModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackBar = inject(SnackbarService);

  pwdHide = true;
  confirmPwdHide = true;
  form!: FormGroup;
  errors!: ValidationError[];

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        fullName: ['', [Validators.required]],
        document: ['', [Validators.required]],
        roles: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      },
      {
        validator: this.passwordsMatchValidator,
      }
    );
  }

  register(): void {
    const mappedDetail: UserDetail = {
      email: this.form.value.email,
      name: this.form.value.fullName,
      document: this.form.value.document,
      password: this.form.value.password,
      roles: [this.form.value.roles],
      isActive: true
    }
    this.authService.register(mappedDetail).subscribe({
      next: (response) => {
        this.snackBar.showMessage(response.message);
        this.router.navigate(['/clientes']);
      },
      error: (err: HttpErrorResponse) => {
        if (err!.status === 400) {
          this.errors = err!.error;
          console.log(this.errors);
          this.snackBar.showMessage('Erros de validação!');
        }
      }
    });
  }

  private passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
