import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './components/main-page/main-page.component';
import { AboutUnionComponent } from './components/about-union/about-union.component';
import { NewsComponent } from './components/news/news.component';

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
