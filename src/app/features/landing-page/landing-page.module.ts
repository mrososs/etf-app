import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SharedModule } from '../../shared/shared.module';
import { CarusolGalleryComponent } from './components/main-page/carusol-gallery/carusol-gallery.component';
import { AboutUnionComponent } from './components/about-union/about-union.component';

@NgModule({
  declarations: [MainPageComponent, CarusolGalleryComponent, AboutUnionComponent],
  imports: [CommonModule, LandingPageRoutingModule, SharedModule],
})
export class LandingPageModule {}
