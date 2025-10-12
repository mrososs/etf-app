import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LandingPageService } from '../../services/landing-page.service';
import { RegisterModel } from '../../models/register.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.scss',
})
export class AuthRegisterComponent {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  private translateService = inject(TranslateService);
  showPassword = false;
  showConfirmationMessage = false;
  passwordStrength = {
    score: 0,
    label: '',
    color: '',
  };

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      this.strongPasswordValidator,
    ]),
  });

  constructor() {
    // Subscribe to password changes to update strength indicator
    this.registerForm.get('password')?.valueChanges.subscribe((value) => {
      this.updatePasswordStrength(value || '');
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const confirmUrl = environment.confirmUrl;

      const data: RegisterModel = {
        username: this.registerForm.value.username || '',
        email: this.registerForm.value.email || '',
        password: this.registerForm.value.password || '',
        confirmUrlAddress: confirmUrl,
      };

      this.landingPageService.register(data).subscribe({
        next: (res) => {
          // Show confirmation message instead of form
          this.showConfirmationMessage = true;
          this.registerForm.reset();

          // Show success toast with translated message
          this.translateService
            .get('register.success.message')
            .subscribe((message) => {
              this.translateService
                .get('register.success.title')
                .subscribe((title) => {
                  this.toasterService.success(message, title);
                });
            });
        },
        error: (err) => {
          // Handle error response
          let errorMessage = '';
          let errorCode = '';

          // Check if error is an array with code and description
          if (Array.isArray(err?.error)) {
            const firstError = err.error[0];
            errorCode = firstError?.code;
            errorMessage = firstError?.description;
          }
          // Check if error has a message property
          else if (err?.error?.message) {
            errorMessage = err.error.message;
          }

          // Get translated title
          this.translateService
            .get('register.error.title')
            .subscribe((title) => {
              // If we have an error code, try to get its translation
              if (errorCode) {
                const translationKey = `register.error.${errorCode}`;
                this.translateService
                  .get(translationKey)
                  .subscribe((translatedMessage) => {
                    // If translation exists (not the same as key), use it
                    // Otherwise, use the original description from API
                    const finalMessage =
                      translatedMessage !== translationKey
                        ? translatedMessage
                        : errorMessage;

                    this.toasterService.error(
                      finalMessage || 'حدث خطأ غير متوقع',
                      title
                    );
                  });
              } else {
                // No error code, use generic message
                this.translateService
                  .get('register.error.message')
                  .subscribe((defaultMessage) => {
                    this.toasterService.error(
                      errorMessage || defaultMessage,
                      title
                    );
                  });
              }
            });
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  get email() {
    return this.registerForm.get('email');
  }
  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  goBackToRegister() {
    this.showConfirmationMessage = false;
  }

  // Custom password validator
  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};
    let hasError = false;

    // Check minimum length
    if (password.length < 8) {
      errors['minLength'] = true;
      hasError = true;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors['noUppercase'] = true;
      hasError = true;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors['noLowercase'] = true;
      hasError = true;
    }

    // Check for number
    if (!/\d/.test(password)) {
      errors['noNumber'] = true;
      hasError = true;
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors['noSpecial'] = true;
      hasError = true;
    }

    return hasError ? errors : null;
  }

  // Update password strength indicator
  updatePasswordStrength(password: string) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    this.passwordStrength.score = score;

    if (score < 2) {
      this.passwordStrength.label = 'register.passwordHints.strength.weak';
      this.passwordStrength.color = '#dc3545';
    } else if (score < 3) {
      this.passwordStrength.label = 'register.passwordHints.strength.medium';
      this.passwordStrength.color = '#ffc107';
    } else if (score < 4) {
      this.passwordStrength.label = 'register.passwordHints.strength.strong';
      this.passwordStrength.color = '#28a745';
    } else {
      this.passwordStrength.label =
        'register.passwordHints.strength.veryStrong';
      this.passwordStrength.color = '#007bff';
    }
  }

  // Helper methods for template
  hasPasswordError(errorType: string): boolean {
    return this.password?.errors?.[errorType] && this.password?.touched;
  }

  getPasswordStrengthLabel(): string {
    return this.passwordStrength.label;
  }

  getPasswordStrengthColor(): string {
    return this.passwordStrength.color;
  }

  // Helper methods for password validation in template
  hasMinLength(): boolean {
    return (this.password?.value?.length || 0) >= 8;
  }

  hasUppercase(): boolean {
    return /[A-Z]/.test(this.password?.value || '');
  }

  hasLowercase(): boolean {
    return /[a-z]/.test(this.password?.value || '');
  }

  hasNumber(): boolean {
    return /\d/.test(this.password?.value || '');
  }

  hasSpecialChar(): boolean {
    return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      this.password?.value || ''
    );
  }
}
