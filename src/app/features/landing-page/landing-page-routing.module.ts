import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AboutUnionComponent } from './components/about-union/about-union.component';
import { NewsComponent } from './components/news/news.component';
import { TourismLegislationComponent } from './components/tourism-legislation/tourism-legislation.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { TrainingComponent } from './components/training/training.component';
import { DivingRoomComponent } from './components/rooms-component/diving-room/diving-room.component';
import { EatRoomComponent } from './components/rooms-component/eat-room/eat-room.component';
import { ProductRoomComponent } from './components/rooms-component/product-room/product-room.component';
import { TravelRoomComponent } from './components/rooms-component/travel-room/travel-room.component';
import { HotelRoomComponent } from './components/rooms-component/hotel-room/hotel-room.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: MainPageComponent,
    data: { title: 'الرئيسية - الاتحاد المصري' },
  },
  {
    path: 'union',
    component: AboutUnionComponent,
    data: { title: 'عن الاتحاد - الاتحاد المصري' },
  },
  {
    path: 'news',
    component: NewsComponent,
    data: { title: 'الأخبار - الاتحاد المصري' },
  },
  {
    path: 'Tourism-legislation',
    component: TourismLegislationComponent,
    data: { title: 'تشريعات السياحية  - الاتحاد المصري' },
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    data: { title: 'تواصل معنا  - الاتحاد المصري' },
  },
  {
    path: 'training',
    component: TrainingComponent,
    data: { title: 'التدريب  - الاتحاد المصري' },
  },
  {
    path: 'diving-room',
    component: DivingRoomComponent,
    data: { title: 'غرفة سياحة الغوص والأنشطة البحرية- الاتحاد المصري' },
  },
  {
    path: 'eat-room',
    component: EatRoomComponent,
    data: { title: 'غرفة المنشآت والمطاعم السياحية- الاتحاد المصري' },
  },
  {
    path: 'product-room',
    component: ProductRoomComponent,
    data: { title: 'غرفة محال العاديات والسلع السياحية- الاتحاد المصري' },
  },
  {
    path: 'travel-room',
    component: TravelRoomComponent,
    data: { title: 'غرفة شركات ووكالات السفر والسياحة - الاتحاد المصري' },
  },
  {
    path: 'hotel-room',
    component: HotelRoomComponent,
    data: { title: 'غرفة المنشآت الفندقية  - الاتحاد المصري' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
