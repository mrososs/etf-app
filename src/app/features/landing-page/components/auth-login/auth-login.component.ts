import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LandingPageService } from '../../services/landing-page.service';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss',
})
export class AuthLoginComponent {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
onSubmit() {
  if (this.loginForm.valid) {
    const data: Login = {
      usernameOrEmail: this.loginForm.value.email || '',
      password: this.loginForm.value.password || ''
    };

    this.landingPageService.login(data).subscribe({
      next: (res) => {
        this.toasterService.success('Login successful!', 'Success');
        localStorage.setItem('auth_token', res.token);
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toasterService.error('Invalid email or password.', 'Login Failed');
      }
    });
  } else {
    this.loginForm.markAllAsTouched();
  }
}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
