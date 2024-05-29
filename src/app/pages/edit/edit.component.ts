import { EditRequest } from '../../interfaces/account/edit-request';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
// Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';
import { UserDetail } from '../../interfaces/account/user-detail';
import { ValidationError } from '../../interfaces/account/validation-error';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, RouterLink, NgIf, MatSelectModule, NgFor, MatProgressSpinnerModule, NgForOf, MatSlideToggleModule, NgxMaskDirective, NgxMaskPipe],
  providers: [provideNgxMask()],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {  
  router = inject(Router);
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  snackBar = inject(SnackbarService);

  route = inject(ActivatedRoute);
  id!: string | null;
  user!: UserDetail | null;

  pwdHide = true;
  confirmPwdHide = true;
  form!: FormGroup;
  errors!: ValidationError[];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
  
      if (this.id != null) {
        this.authService.getIdDetail(this.id).subscribe(user => {
          this.user = user;
          //console.log(user);
  
          // Initialize the form after receiving the user data
          this.initializeForm();
        });
      } else {
        // Initialize the form even if there's no id or user data
        this.initializeForm();
      }      
    });
  }

  initializeForm(): void {
    this.form = this.fb.group(
      {
        email: [this.user?.email, [Validators.required, Validators.email]],
        fullName: [this.user?.name, [Validators.required]],
        document: [this.user?.document, [Validators.required]],
        roles: [this.user?.roles, [Validators.required]], 
        password: ['', [Validators.minLength(8)]],
        disabled: [this.user?.isActive, [Validators.required]]
      }
    );
  }

  edit(): void {
    const mappedDetail: UserDetail = {
      email: this.form.value.email,
      name: this.form.value.fullName,
      document: this.form.value.document,
      password: this.form.value.password,
      roles: [this.form.value.roles],
      isActive: this.form.value.disabled
    }
    this.authService.editUser(mappedDetail, this.id!).subscribe({
      next: (response) => {
        this.snackBar.showMessage(response.message);
        this.router.navigate(['/clientes']);
      },
      error: (err: HttpErrorResponse) => {
        if(err!.status===400) {
          console.log(err!.error);
          this.errors = err!.error;
          this.snackBar.showMessage('Erros de validação!');
        }
      },
      complete: () => {
        console.log('Sucesso ao registrar');
      }
    });
  }
}
