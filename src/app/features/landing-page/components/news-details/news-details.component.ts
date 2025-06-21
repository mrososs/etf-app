import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsItem } from '../../models/news.model';
import { LandingPageService } from '../../services/landing-page.service';
import { TourismNews } from '../../models/tourism-news.model';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.scss',
})
export class NewsDetailsComponent {
  private route = inject(ActivatedRoute);
  private landingService = inject(LandingPageService);
  newsItem!: NewsItem | TourismNews | undefined;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const type = this.route.snapshot.queryParamMap.get('type');

    if (type === 'tourism') {
      this.landingService.getTourismNews().subscribe((items) => {
        this.newsItem = items.find((item) => item.id === id);
      });
    } else {
      this.landingService.getNewsItems().subscribe((items) => {
        this.newsItem = items.find((item) => item.id === id);
      });
    }
  }
}
