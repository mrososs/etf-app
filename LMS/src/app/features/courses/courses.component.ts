import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBannerComponent } from './top-banner/top-banner.component';
import { LogoBannerComponent } from './logo-banner/logo-banner.component';
import { TypesComponent } from './types/types.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule,TopBannerComponent,LogoBannerComponent,TypesComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent {}
