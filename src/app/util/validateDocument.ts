import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validateCPF } from './validateCPF';
import { validateCNPJ } from './validateCNPJ';

export function cpfCnpjFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const isValid = validateCpfCnpj(value);
    return isValid ? null : { cpfCnpj: { value: control.value } };
  };
}

export function validateCpfCnpj(value: string): boolean {
  if (value.length === 11) {
    return validateCPF(value);
  } else if (value.length === 14) {
    return validateCNPJ(value);
  }
  return false;
}




