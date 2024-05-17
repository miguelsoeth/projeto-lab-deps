import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SnackbarService } from '../services/snackbar.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const roles = route.data["roles"] as string[];
  const authService = inject(AuthService);
  const snackbar = inject(SnackbarService);
  const router = inject(Router);
  const userRoles = authService.getRoles();

  if (!authService.isLoggedIn()) {
    router.navigate(["/login"]);
    snackbar.showMessage('Você deve estar logado para acessar essa página!', 4000,  'Ok');
    return false;
  }

  if(roles.some((role) =>userRoles?.includes(role))) return true;

  router.navigate(["/"]);
  snackbar.showMessage('Você não tem permissão para acessar essa página!', 4000,  'Ok');

  return false;
};
