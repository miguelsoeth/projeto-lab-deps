import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  showMessage(msg: string, time?: number, close?: string): void {
    this.snackBar.open(msg, close, {
      duration: time !== undefined ? time : 2000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }
  
}
