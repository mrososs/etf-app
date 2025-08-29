import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsItem } from '../../models/news.model';
import { LandingPageService } from '../../services/landing-page.service';
import { TourismNews } from '../../models/tourism-news.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.scss',
})
export class NewsDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private landingService = inject(LandingPageService);
  newsItem!: NewsItem | TourismNews | undefined;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const type = this.route.snapshot.queryParamMap.get('type');

    if (type === 'touristnews') {
      this.landingService.getTourismNewsById(id).subscribe((item) => {
        this.newsItem = item;
      });
    } else {
      this.landingService.getNewsItemById(id).subscribe((item) => {
        this.newsItem = item;
      });
    }
  }

  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return 'assets/img/blankImage.jpg'; // fallback image
    }

    // If the URL is already absolute (starts with http), return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // If it's a relative path starting with /uploads/, prefix with API base URL
    if (imageUrl.startsWith('/uploads/')) {
      return `${environment.apiBaseUrl}${imageUrl}`;
    }

    // For other relative paths, assume they're assets
    return imageUrl;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/blankImage.jpg';
  }
}
