import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SharedModule } from '../../shared/shared.module';
import { CarusolGalleryComponent } from './components/main-page/carusol-gallery/carusol-gallery.component';
import { AboutUnionComponent } from './components/about-union/about-union.component';
import { NewsComponent } from './components/news/news.component';

@NgModule({
  declarations: [MainPageComponent, CarusolGalleryComponent, AboutUnionComponent, NewsComponent],
  imports: [CommonModule, LandingPageRoutingModule, SharedModule],
})
export class LandingPageModule {}
