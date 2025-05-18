import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SharedModule } from '../../shared/shared.module';
import { CarusolGalleryComponent } from './components/main-page/carusol-gallery/carusol-gallery.component';
import { AboutUnionComponent } from './components/about-union/about-union.component';
import { NewsComponent } from './components/news/news.component';
import { TourismLegislationComponent } from './components/tourism-legislation/tourism-legislation.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TrainingComponent } from './components/training/training.component';
import { DivingRoomComponent } from './components/rooms-component/diving-room/diving-room.component';
import { TravelRoomComponent } from './components/rooms-component/travel-room/travel-room.component';
import { HotelRoomComponent } from './components/rooms-component/hotel-room/hotel-room.component';
import { EatRoomComponent } from './components/rooms-component/eat-room/eat-room.component';
import { ProductRoomComponent } from './components/rooms-component/product-room/product-room.component';

@NgModule({
  declarations: [
    MainPageComponent,
    CarusolGalleryComponent,
    AboutUnionComponent,
    NewsComponent,
    TourismLegislationComponent,
    ContactUsComponent,
    TrainingComponent,
    DivingRoomComponent,
    TravelRoomComponent,
    HotelRoomComponent,
    EatRoomComponent,
    ProductRoomComponent,
  ],
  imports: [CommonModule, LandingPageRoutingModule, SharedModule],
})
export class LandingPageModule {}
