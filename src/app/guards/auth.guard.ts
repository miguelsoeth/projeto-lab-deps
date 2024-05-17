import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const snackbar = inject(SnackbarService);
  
  if(inject(AuthService).isLoggedIn()) {
    return true;
  }

  snackbar.showMessage('Você deve estar logado para acessar essa página!', 4000,  'Ok');  
  inject(Router).navigate(['/login']);
  return false;
};
