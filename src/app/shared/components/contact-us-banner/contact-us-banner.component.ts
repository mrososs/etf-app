import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us-banner',
  templateUrl: './contact-us-banner.component.html',
  styleUrl: './contact-us-banner.component.scss',
})
export class ContactUsBannerComponent {
  translate = inject(TranslateService);

  get mapImage(): string {
    return this.translate.currentLang === 'en'
      ? '../../../../assets/img/footerMap2.png'
      : '../../../../assets/img/footerMap.jpg';
  }
}
