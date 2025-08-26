import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-confirm-register',
  templateUrl: './confirm-register.component.html',
  styleUrl: './confirm-register.component.scss',
})
export class ConfirmRegisterComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private translateService = inject(TranslateService);
  private toasterService = inject(ToastrService);

  isLoading = true;
  isSuccess = false;
  errorMessage = '';
  countdown = 5;

  ngOnInit() {
    this.handleConfirmation();
  }

  private handleConfirmation() {
    // Get userId and token from URL parameters
    this.route.queryParams.subscribe((params) => {
      const userId = params['userId'];
      const token = params['token'];

      console.log('Confirm Register - URL Parameters:', { userId, token });
      console.log('Current URL:', window.location.href);

      if (userId && token) {
        // Store in localStorage
        localStorage.setItem('pendingUserId', userId);
        localStorage.setItem('pendingToken', token);

        // Store in cookies (optional, for better compatibility)
        this.setCookie('pendingUserId', userId, 1); // 1 day expiry
        this.setCookie('pendingToken', token, 1);

        this.isSuccess = true;
        this.isLoading = false;

        // Show success message
        this.translateService
          .get('confirmRegister.success')
          .subscribe((message: string) => {
            this.toasterService.success(message, 'Success');
          });

        // Start countdown and redirect
        this.startCountdown();
      } else {
        this.isSuccess = false;
        this.isLoading = false;

        // Get translated error message
        this.translateService
          .get('confirmRegister.invalidLink')
          .subscribe((message: string) => {
            this.errorMessage = message;
          });

        console.error('Confirm Register - Missing parameters:', {
          userId,
          token,
        });

        this.translateService
          .get('confirmRegister.errorTitle')
          .subscribe((title: string) => {
            this.toasterService.error(this.errorMessage, title);
          });
      }
    });
  }

  private startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.router.navigate(['/landing-page/login']);
      }
    }, 1000);
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }

  goToLogin() {
    this.router.navigate(['/landing-page/login']);
  }

  // Getter for countdown display
  get countdownDisplay(): string {
    return this.countdown.toString();
  }
}
