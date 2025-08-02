import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LandingPageService } from '../../services/landing-page.service';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../../models/login.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss',
})
export class AuthLoginComponent implements OnInit {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  showPassword = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });

  ngOnInit() {
    this.checkForPendingConfirmation();
  }

  private checkForPendingConfirmation() {
    // Check if user came from confirmation page
    const pendingUserId = localStorage.getItem('pendingUserId');
    const pendingToken = localStorage.getItem('pendingToken');

    if (pendingUserId && pendingToken) {
      // Show success message that account was confirmed
      this.translateService
        .get('login.accountConfirmed')
        .subscribe((message: string) => {
          this.toasterService.success(message, 'Success');
        });

      // Clear the stored values
      localStorage.removeItem('pendingUserId');
      localStorage.removeItem('pendingToken');
      this.clearCookie('pendingUserId');
      this.clearCookie('pendingToken');
    }
  }

  private clearCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.loginForm.valid) {
      const data: Login = {
        usernameOrEmail: this.loginForm.value.email || '',
        password: this.loginForm.value.password || '',
      };

      this.landingPageService.login(data).subscribe({
        next: (res) => {
          this.toasterService.success('Login successful!', 'Success');
          localStorage.setItem('auth_token', res);
        },
        error: (err) => {
          this.toasterService.error(
            'Invalid email or password.',
            'Login Failed'
          );
        },
        complete: () => {
          this.router.navigate(['/landing-page/home']);
        },
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
