import { Component, inject } from '@angular/core';
import { LangService } from '../../../core/services/lang.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  resourcePath = 'navbar.';
  private langService = inject(LangService);

  changeLang(lang: string) {
    this.langService.setLang(lang);
  }
  get currentLang(): string {
    return this.langService.currentLang;
  }
}
