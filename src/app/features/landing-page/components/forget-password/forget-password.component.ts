import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Login } from '../../models/login.model';
import { LandingPageService } from '../../services/landing-page.service';
import { forgetPasswordModel } from '../../models/forgetpassword.model';
import { Router } from '@angular/router';

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
      const confirmUrl = 'https://etf.itechpro-eg.com/resetpassword';

      const data: forgetPasswordModel = {
        email: this.forgetPasswordForm.value.email || '',
        resetPasswordUrl: confirmUrl,
      };

      this.landingPageService.forgetPassword(data).subscribe({
        next: (res) => {
          this.toasterService.success(
            'send to your email the token!',
            'Success'
          );
          this.router.navigate(['/landing-page/resetpassword']);
        },
        error: (err) => {
          this.toasterService.error('Invalid email .', '');
        },
        complete: () => this.router.navigate(['/landing-page/resetpassword']),
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
