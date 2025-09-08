import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
// import { SeoService } from '../../../shared/seo/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  standalone: true,
  imports: [RouterModule],
})
export class NotFoundComponent implements OnInit {
  // private seoService = inject(SeoService);

  ngOnInit(): void {
    // this.seoService.updateSeo({
    //   title: '404 - الصفحة غير موجودة | الإتحاد المصري للسياحة',
    //   description: 'الصفحة التي تبحث عنها غير موجودة. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.',
    //   noindex: true
    // });
  }
}
