import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { LangService } from '../../../core/services/lang.service';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  resourcePath = 'navbar.';
  isScrolled = false;

  private langService = inject(LangService);

  // ⬅️ النقطة المهمة: استخدام ViewChild عشان نوصل لعنصر collapse
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  ngOnInit(): void {
    window.addEventListener('scroll', this.onScroll, true);
  }

  @HostListener('window:scroll', [])
  onScroll = () => {
    this.isScrolled = window.scrollY > 50;
  };

  closeNavbar() {
    const collapseEl = this.navbarCollapse?.nativeElement;
    if (collapseEl && window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }

  changeLang(lang: string) {
    this.langService.setLang(lang);
    this.closeNavbar();
  }

  get currentLang(): string {
    return this.langService.currentLang;
  }
}
