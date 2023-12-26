import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const checkPasswordsValidator: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
  console.log("pass validator");
  let password = group.get('password')?.value;
  let confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passNotMatch: true }
}