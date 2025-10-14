import {
  Component,
  inject,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { filter, map, mergeMap } from 'rxjs/operators';
import { LangService } from './core/services/lang.service';
import { LoaderService } from './core/services/loader.service';
import { TokenExpiryService } from './core/services/token-expiry.service';
// import { SeoService } from './shared/seo/seo.service';
// import { StructuredDataService } from './shared/seo/structured-data.service';
// import { AnalyticsService } from './shared/analytics/analytics.service';
import { LayoutModule } from './layout/layout.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet, CommonModule, ProgressSpinnerModule, LayoutModule],
})
export class AppComponent implements OnInit {
  title = 'etf-app';
  loader = inject(LoaderService);

  private _langService = inject(LangService);
  private _titleService = inject(Title);
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _tokenExpiryService = inject(TokenExpiryService);
  // private _seoService = inject(SeoService);
  // private _structuredDataService = inject(StructuredDataService);
  // private _analyticsService = inject(AnalyticsService);

  ngOnInit(): void {
    // Initialize token expiry checking
    // This will check for expired tokens immediately and then every hour
    this._tokenExpiryService.initTokenExpiryCheck();

    // Initialize Google Analytics
    // this._analyticsService.init();
    // Add organization schema site-wide
    // this._structuredDataService.addOrganizationSchema({
    //   name: 'الإتحاد المصري للسياحة',
    //   url: 'https://etf-egypt.com',
    //   logo: 'https://etf-egypt.com/assets/img/logo.png',
    //   description: 'الإتحاد المصري للسياحة - منظمة غير حكومية تعمل على تطوير وتنمية قطاع السياحة في مصر',
    //   sameAs: [
    //     'https://www.facebook.com/etf.egypt',
    //     'https://www.twitter.com/etf_egypt',
    //     'https://www.linkedin.com/company/etf-egypt'
    //   ]
    // });
  }

  constructor() {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this._activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        if (data['seo']) {
          // this._seoService.updateSeo(data['seo']);
        } else if (data['title']) {
          // Fallback for existing title-only data
          // this._seoService.updateSeo({
          //   title: data['title'],
          //   description: 'الإتحاد المصري للسياحة - منظمة غير حكومية تعمل على تطوير وتنمية قطاع السياحة في مصر'
          // });
        }
      });
  }
}
