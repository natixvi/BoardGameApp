import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const checkPasswordsValidator: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    const password = group.get('password')?.value;
    const confirmPassword = group.get('conformPassword')?.value;
    return password === confirmPassword ? null : { notSame: true }
  }