import { Component, inject, OnInit } from '@angular/core';
import { ResetPasswordModel } from '../../models/token.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandingPageService } from '../../services/landing-page.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  showPassword = false;
  isLoading = false;
  private resetToken: string = '';
  private resetUserId: string = '';

  resetPasswordForm = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnInit() {
    this.handleResetPassword();
  }

  private handleResetPassword() {
    // Get token and userId from localStorage only
    this.resetToken = localStorage.getItem('resetToken') || '';
    this.resetUserId = localStorage.getItem('resetUserId') || '';

    console.log('Using localStorage:', {
      resetToken: this.resetToken ? 'exists' : 'missing',
      resetUserId: this.resetUserId ? 'exists' : 'missing',
    });

    // If token or userId is missing, redirect to forget password
    if (!this.resetToken || !this.resetUserId) {
      console.log('Missing token or userId, redirecting to forget password');
      this.toasterService.error(
        'Invalid reset link. Please request a new password reset.',
        'Error'
      );
      this.router.navigate(['/landing-page/forgetpassword']);
    } else {
      console.log('Token and userId found, ready for password reset');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;
      const data: ResetPasswordModel = {
        userId: this.resetUserId,
        token: this.resetToken,
        newPassword: this.resetPasswordForm.value.newPassword || '',
      };

      this.landingPageService.resetPassword(data).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.toasterService.success(
            'Password changed successfully!',
            'Success'
          );
          // Clear localStorage after successful reset
          localStorage.removeItem('resetToken');
          localStorage.removeItem('resetUserId');
          this.router.navigate(['/landing-page/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.toasterService.error(
            'Failed to reset password. Please try again.',
            'Error'
          );
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  get password() {
    return this.resetPasswordForm.get('newPassword');
  }
}
