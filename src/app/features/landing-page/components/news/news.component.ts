import { Component, inject, OnInit } from '@angular/core';
import { NewsItem } from '../../models/news.model';
import { TourismNews } from '../../models/tourism-news.model';
import { LandingPageService } from '../../services/landing-page.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  newsItems: NewsItem[] = [];
  tourismNews: TourismNews[] = [];
  private landingService = inject(LandingPageService);
  ngOnInit(): void {
    this.landingService.getNewsItems().subscribe((data) => {
      this.newsItems = data;
    });

    this.landingService.getTourismNews().subscribe((data) => {
      this.tourismNews = data;
    });
  }
}
