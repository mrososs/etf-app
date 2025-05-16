import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedNavigateButtonComponent } from './components/shared-navigate-button/shared-navigate-button.component';
import { ContactUsBannerComponent } from './components/contact-us-banner/contact-us-banner.component';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [SharedNavigateButtonComponent, ContactUsBannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    OrganizationChartModule,
    InputTextModule,
    
  ],
  exports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    OrganizationChartModule,
    TranslateModule,
    SharedNavigateButtonComponent,
    ContactUsBannerComponent,
  ],
})
export class SharedModule {}
