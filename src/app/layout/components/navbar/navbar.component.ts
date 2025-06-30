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
  isLoggedIn: boolean = false;

  isScrolled = false;
  visible: boolean = false;
  visibleLogin: boolean = false;
  themes = [
    {
      class: 'theme-orange-yellow',
      image: '../../../../assets/img/logoColor/orange.png',
    },
    {
      class: 'theme-green-cyan',
      image: '../../../../assets/img/logoColor/green.png',
    },
    { class: 'theme-cyan', image: '../../../../assets/img/logoColor/blue.png' },
    {
      class: 'theme-purple',
      image: '../../../../assets/img/logoColor/purple.png',
    },
    {
      class: 'theme-yellow-orange',
      image: '../../../../assets/img/logoColor/yellow.png',
    },
  ];
  visibleLogoutConfirm: boolean = false;

  private langService = inject(LangService);

  // ⬅️ النقطة المهمة: استخدام ViewChild عشان نوصل لعنصر collapse
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    console.log(this.isLoggedIn);

    window.addEventListener('scroll', this.onScroll, true);
  }

  @HostListener('window:scroll', [])
  onScroll = () => {
    this.isScrolled = window.scrollY > 50;
  };
  showDialog() {
    this.visible = true;
  }
  logout() {
    localStorage.clear();
    document.cookie = ''; // مسح أي cookies إن وجدت
    this.visibleLogoutConfirm = false;
    this.isLoggedIn = false;
    window.location.href = '/landing-page/login'; // إعادة التوجيه
  }

  showLogin() {
    this.visibleLogin = true;
  }
  closeNavbar() {
    const collapseEl = this.navbarCollapse?.nativeElement;
    if (collapseEl && window.innerWidth < 992) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  }
  changeTheme(themeClass: string) {
    document.body.className = ''; // clear old
    document.body.classList.add(themeClass);
    localStorage.setItem('theme', themeClass); // optional persistence
  }

  changeLang(lang: string) {
    this.langService.setLang(lang);
    this.closeNavbar();
  }

  get currentLang(): string {
    return this.langService.currentLang;
  }
}
