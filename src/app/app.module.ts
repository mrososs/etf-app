import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastrModule } from 'ngx-toastr';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
// Factory function
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    ProgressSpinnerModule,

    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', // أو toast-top-right
      timeOut: 3000,
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: 'ar',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    provideHttpClient(withInterceptors([ loaderInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
