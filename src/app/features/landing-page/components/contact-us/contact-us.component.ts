import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LandingPageService } from '../../services/landing-page.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  private landingPageService = inject(LandingPageService);
  private toastr = inject(ToastrService);
  contactForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl(''),
  });
  onSubmit() {
    if (this.contactForm.valid) {
      this.landingPageService.getContactUs(this.contactForm.value).subscribe({
        next: (res) => {
          this.contactForm.reset();
          this.toastr.success('تم إرسال الرسالة بنجاح');
        },
        error: () => {
          this.toastr.error('حدث خطأ أثناء الإرسال');
        },
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
