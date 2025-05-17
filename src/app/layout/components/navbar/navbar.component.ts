import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LangService } from '../../../core/services/lang.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  resourcePath = 'navbar.';
  isScrolled = false;
  private langService = inject(LangService);
  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, true);
  }
  @HostListener('window:scroll', [])
  onScroll = () => {
    this.isScrolled = window.scrollY > 50;
  };

  changeLang(lang: string) {
    this.langService.setLang(lang);
  }
  get currentLang(): string {
    return this.langService.currentLang;
  }
}
