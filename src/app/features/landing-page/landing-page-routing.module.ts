import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
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
import { NewsDetailsComponent } from './components/news-details/news-details.component';
import { AuthLoginComponent } from './components/auth-login/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register/auth-register.component';
import { ConfirmRegisterComponent } from './components/confirm-register/confirm-register.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: MainPageComponent,
    data: {
      seo: {
        title: 'الرئيسية - الإتحاد المصري للسياحة',
        description:
          'مرحباً بكم في موقع الإتحاد المصري للسياحة - منظمة غير حكومية تعمل على تطوير وتنمية قطاع السياحة في مصر',
        keywords:
          'الإتحاد المصري للسياحة، السياحة في مصر، تنمية السياحة، منظمة سياحية',
        ogImage: '/assets/img/logo.png',
        url: 'https://etf-egypt.com/landing-page/home',
      },
    },
  },
  {
    path: 'newsdetails/:id',
    component: NewsDetailsComponent,
    data: { title: 'الاخبار' },
  },
  {
    path: 'login',
    component: AuthLoginComponent,
    data: {
      title: 'تسجيل الدخول - الإتحاد المصري',
    },
  },
  {
    path: 'register',
    component: AuthRegisterComponent,
    data: {
      title: 'انشاء حساب - الإتحاد المصري',
    },
  },
  {
    path: 'confirm-register',
    component: ConfirmRegisterComponent,
    data: {
      title: 'تأكيد التسجيل - الإتحاد المصري',
    },
  },
  {
    path: 'test-confirm',
    component: ConfirmRegisterComponent,
    data: {
      title: 'Test Confirm - الإتحاد المصري',
    },
  },
  {
    path: 'forgetPassword',
    component: ForgetPasswordComponent,
    data: {
      title: 'نسيت الباسورد - الإتحاد المصري',
    },
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent,
    data: {
      title: 'تغير الباسورد - الإتحاد المصري',
    },
  },
  {
    path: 'reset-password',
    redirectTo: 'resetpassword',
    pathMatch: 'full',
  },
  {
    path: 'union',
    component: AboutUnionComponent,
    data: {
      seo: {
        title: 'عن الإتحاد - الإتحاد المصري للسياحة',
        description:
          'تعرف على الإتحاد المصري للسياحة - تاريخنا، رؤيتنا، رسالتنا، وأهدافنا في تطوير قطاع السياحة المصري',
        keywords:
          'عن الإتحاد، الإتحاد المصري للسياحة، تاريخ الإتحاد، رؤية الإتحاد، رسالة الإتحاد',
        ogImage: '/assets/img/aboutUnion.jpeg',
        url: 'https://etf-egypt.com/landing-page/union',
      },
    },
  },
  {
    path: 'news',
    component: NewsComponent,
    data: {
      seo: {
        title: 'الأخبار - الإتحاد المصري للسياحة',
        description:
          'تابع آخر أخبار الإتحاد المصري للسياحة وأحدث التطورات في قطاع السياحة المصري',
        keywords:
          'أخبار الإتحاد، أخبار السياحة، أخبار مصر السياحية، تطورات السياحة',
        ogImage: '/assets/img/newsBackground.jpg',
        url: 'https://etf-egypt.com/landing-page/news',
      },
    },
  },
  {
    path: 'Tourism-legislation',
    component: TourismLegislationComponent,
    data: { title: 'تشريعات السياحية  - الإتحاد المصري' },
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    data: {
      seo: {
        title: 'تواصل معنا - الإتحاد المصري للسياحة',
        description:
          'تواصل مع الإتحاد المصري للسياحة - معلومات الاتصال، العنوان، الهاتف، البريد الإلكتروني',
        keywords:
          'تواصل معنا، الإتحاد المصري للسياحة، معلومات الاتصال، العنوان، الهاتف',
        ogImage: '/assets/img/contactUsBackground.jpg',
        url: 'https://etf-egypt.com/landing-page/contact-us',
      },
    },
  },
  {
    path: 'training',
    component: TrainingComponent,
    data: { title: 'التدريب  - الإتحاد المصري' },
  },
  {
    path: 'diving-room',
    component: DivingRoomComponent,
    data: { title: 'غرفة سياحة الغوص والأنشطة البحرية- الإتحاد المصري' },
  },
  {
    path: 'eat-room',
    component: EatRoomComponent,
    data: { title: 'غرفة المنشآت والمطاعم السياحية- الإتحاد المصري' },
  },
  {
    path: 'product-room',
    component: ProductRoomComponent,
    data: { title: 'غرفة محال العاديات والسلع السياحية- الإتحاد المصري' },
  },
  {
    path: 'travel-room',
    component: TravelRoomComponent,
    data: { title: 'غرفة شركات ووكالات السفر والسياحة - الإتحاد المصري' },
  },
  {
    path: 'hotel-room',
    component: HotelRoomComponent,
    data: { title: 'غرفة المنشآت الفندقية  - الإتحاد المصري' },
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      seo: {
        title: '404 - الصفحة غير موجودة | الإتحاد المصري للسياحة',
        description:
          'الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.',
        noindex: true,
      },
    },
  },
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', // ⬅️ دي المهمة
  anchorScrolling: 'enabled',
  scrollOffset: [0, 0],
};

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
