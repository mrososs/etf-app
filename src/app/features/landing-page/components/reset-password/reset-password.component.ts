import { Component, inject } from '@angular/core';
import { ResetPasswordModel } from '../../models/token.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LandingPageService } from '../../services/landing-page.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private landingPageService = inject(LandingPageService);
  private toasterService = inject(ToastrService);
  private router = inject(Router);

  showPassword = false;

  resetPasswordForm = new FormGroup({
    userId: new FormControl('', Validators.required),
    token: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required),
  });
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
onSubmit() {
  if (this.resetPasswordForm.valid) {
    const data: ResetPasswordModel = {
      userId: this.resetPasswordForm.value.userId || '',
      token: this.resetPasswordForm.value.token || '',
      newPassword: this.resetPasswordForm.value.newPassword || '',
    };

    this.landingPageService.resetPassword(data).subscribe({
      next: (res) => {
        this.toasterService.success('Password changed successfully!', 'Success');
        this.router.navigate(['/landing-page/login']);
      },
      error: (err) => {
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

  get userId() {
    return this.resetPasswordForm.get('userId');
  }
  get token() {
    return this.resetPasswordForm.get('token');
  }

  get password() {
    return this.resetPasswordForm.get('newPassword');
  }
}
