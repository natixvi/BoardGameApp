import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// interface PasswordValidationArgs {
//   passwordControlName: string;
//   confirmPasswordControlName: string;
// }

// export const checkPasswordsValidator: (args: PasswordValidationArgs) => ValidatorFn = 
export const checkPasswordsValidator:  ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 

    let password = group.get('password')?.value;
    let confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passNotMatch: true }
  }