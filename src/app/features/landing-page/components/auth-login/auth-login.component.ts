import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LandingPageService } from '../../services/landing-page.service';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../../models/login.model';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  DynamicDialogRef,
  DynamicDialogConfig,
  DialogService,
} from 'primeng/dynamicdialog';
import { LoginSuccessDialogComponent } from '../login-success-dialog/login-success-dialog.component';
import { environment } from '../../../../../environments/environment';
import { TokenExpiryService } from '../../../../core/services/token-expiry.service';

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
  private dialogService = inject(DialogService);
  private tokenExpiryService = inject(TokenExpiryService);
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

          // Store token with 24-hour expiry using TokenExpiryService
          this.tokenExpiryService.storeTokenWithExpiry(res, 24);

          document.cookie = `token=${res}; path=/; domain=.itechpro-eg.com; secure; SameSite=None`;

          // Trigger storage event to notify navbar of login state change
          window.dispatchEvent(
            new StorageEvent('storage', {
              key: 'auth_token',
              newValue: res,
              url: window.location.href,
            })
          );

          // Also dispatch a custom event for better communication
          window.dispatchEvent(
            new CustomEvent('loginStateChanged', {
              detail: { isLoggedIn: true, token: res },
            })
          );

          // Show login success dialog
          this.showLoginSuccessDialog(res);
        },
        error: (err) => {
          this.toasterService.error(
            'Invalid email or password.',
            'Login Failed'
          );
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

  private showLoginSuccessDialog(token: string) {
    const ref = this.dialogService.open(LoginSuccessDialogComponent, {
      header: '',
      width: '500px',
      modal: true,
      dismissableMask: false,
      closable: false,
      styleClass: 'login-success-dialog-container',
    });

    ref.onClose.subscribe((result: string) => {
      if (result === 'website') {
        this.router.navigate(['/landing-page/home']);
      } else if (result === 'training') {
        this.redirectToTrainingPlatform(token);
      } else {
        // Default to home page if cancelled
        this.router.navigate(['/landing-page/home']);
      }
    });
  }

  private redirectToTrainingPlatform(token: string) {
    const pendingUserId = localStorage.getItem('pendingUserId');
    const pendingToken = localStorage.getItem('pendingToken');

    const lmsUrl = environment.lmsUrl;
    let urlWithParams = `${lmsUrl}?token=${token}`;

    // Add pending confirmation parameters if they exist
    if (pendingUserId && pendingToken) {
      urlWithParams += `&userId=${pendingUserId}&confirmToken=${pendingToken}`;
      // Clear the pending values after using them
      localStorage.removeItem('pendingUserId');
      localStorage.removeItem('pendingToken');
    }

    window.open(urlWithParams, '_blank');

    // Also navigate to home page
    this.router.navigate(['/landing-page/home']);
  }
}
