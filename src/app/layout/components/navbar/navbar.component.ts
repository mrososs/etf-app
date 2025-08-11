import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { LangService } from '../../../core/services/lang.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
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
  private toasterService = inject(ToastrService);
  private translateService = inject(TranslateService);

  // ⬅️ النقطة المهمة: استخدام ViewChild عشان نوصل لعنصر collapse
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;

  ngOnInit(): void {
    this.checkLoginStatus();
    window.addEventListener('scroll', this.onScroll, true);

    // Listen for storage changes to update login status
    window.addEventListener('storage', this.handleStorageChange.bind(this));

    // Also listen for custom events that might be triggered from other components
    window.addEventListener(
      'loginStateChanged',
      this.checkLoginStatus.bind(this)
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll, true);
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    window.removeEventListener(
      'loginStateChanged',
      this.checkLoginStatus.bind(this)
    );
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem('auth_token');
    this.isLoggedIn = !!token;
    console.log('Login status:', this.isLoggedIn, 'Token exists:', !!token);
  }

  private handleStorageChange(event: StorageEvent): void {
    if (event.key === 'auth_token') {
      this.checkLoginStatus();
    }
  }

  // Check if current page is login page
  isOnLoginPage(): boolean {
    return window.location.pathname.includes('/login');
  }

  @HostListener('window:scroll', [])
  onScroll = () => {
    this.isScrolled = window.scrollY > 50;
  };

  showDialog() {
    this.visible = true;
  }

  logout() {
    // Show success message
    this.translateService
      .get('navbar.logoutSuccess')
      .subscribe((message: string) => {
        this.toasterService.success(message, 'Success');
      });

    // Clear localStorage
    localStorage.removeItem('auth_token');

    // Clear cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie =
      'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.itechpro-eg.com;';

    // Update login status
    this.isLoggedIn = false;
    this.visibleLogoutConfirm = false;

    // Dispatch events to notify other components
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'auth_token',
        newValue: null,
        url: window.location.href,
      })
    );

    window.dispatchEvent(
      new CustomEvent('loginStateChanged', {
        detail: { isLoggedIn: false, token: null },
      })
    );

    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = '/landing-page/login';
    }, 1000);
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
