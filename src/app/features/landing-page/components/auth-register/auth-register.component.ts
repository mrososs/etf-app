import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandingPageService } from '../../services/landing-page.service';
import { RegisterModel } from '../../models/register.model';

@Component({
  selector: 'app-auth-register',
  templateUrl: './auth-register.component.html',
  styleUrl: './auth-register.component.scss',
})
export class AuthRegisterComponent {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  showPassword = false;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.registerForm.valid) {
      const confirmUrl = 'https://etf.itechpro-eg.com/confirm-register';

      const data: RegisterModel = {
        username: this.registerForm.value.username || '',
        email: this.registerForm.value.email || '',
        password: this.registerForm.value.password || '',
        confirmUrlAddress: confirmUrl,
      };

      this.landingPageService.register(data).subscribe({
        next: (res) => {
          this.toasterService.success(
            'Account created successfully. Please check your email to activate it.',
            'Registration Success'
          );
          this.registerForm.reset();
        },
        error: (err) => {
          const message =
            err?.error?.message || 'Something went wrong during registration.';
          this.toasterService.error(message, 'Registration Failed');
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
}
