import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../../models/login.model';
import { LandingPageService } from '../../services/landing-page.service';
import { forgetPasswordModel } from '../../models/forgetpassword.model';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  router = inject(Router);
  showPassword = false;

  forgetPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      const confirmUrl = environment.resetPasswordUrl;

      const data: forgetPasswordModel = {
        email: this.forgetPasswordForm.value.email || '',
        resetPasswordUrl: confirmUrl,
      };

      this.landingPageService.forgetPassword(data).subscribe({
        next: (res) => {
          // Save token and userId to localStorage as fallback
          if (res.token && res.userId) {
            localStorage.setItem('resetToken', res.token);
            localStorage.setItem('resetUserId', res.userId);
          }

          // Show the message from the response
          this.toasterService.success(
            res.message ||
              'Password reset link has been sent if the email exists.',
            'Success'
          );
          // Don't navigate automatically - user will receive email with link
        },
        error: (err) => {
          this.toasterService.error('Invalid email .', '');
        },
      });
    } else {
      this.forgetPasswordForm.markAllAsTouched();
    }
  }

  get email() {
    return this.forgetPasswordForm.get('email');
  }

  get password() {
    return this.forgetPasswordForm.get('password');
  }
}
