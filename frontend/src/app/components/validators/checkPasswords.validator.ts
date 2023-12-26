import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

interface PasswordValidationArgs {
  passwordControlName: string;
  confirmPasswordControlName: string;
}

export const checkPasswordsValidator: (args: PasswordValidationArgs) => ValidatorFn = 
({ passwordControlName, confirmPasswordControlName }: PasswordValidationArgs) => 
(group: AbstractControl): ValidationErrors | null => {

    let password = group.get(passwordControlName)?.value;
    let confirmPassword = group.get(confirmPasswordControlName)?.value;
    return password === confirmPassword ? null : { passNotMatch: true }
  }