import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.getToken())      
    })
    console.log("Enviando...");
    return next(cloned).pipe(
      catchError((err:HttpErrorResponse) => {
        if(err.status===401) {
          console.log("Revalidando token...");
          const tokenObj = {
            refreshToken: authService.getRefreshToken() || "",
            token: authService.getToken() || "",
            email: authService.getUserDetail()?.email            
          }
          console.log("tokenObj:", tokenObj);
          authService.refreshToken(tokenObj).subscribe({
            next:(response) => {
              console.log("response:", response);
              if(response.isSuccess) {
                localStorage.setItem("user", JSON.stringify(response));
                const cloned=req.clone({
                  setHeaders:{
                    Authorization: `Bearer ${response.token}`
                  }
                });
                console.log("Token revalidado! Reenviando requisição com novo token...");
                location.reload();
              }
            },
            error:() => {
              console.log("Erro ao revalidar! deslogando...");
              authService.logout();
              router.navigate(['/login']);
            },
          });
        }
        return throwError(err);
      })
    )
  }

  return next(req);
};
