import { Component, inject, OnInit } from '@angular/core';
import { NewsItem } from '../../models/news.model';
import { TourismNews } from '../../models/tourism-news.model';
import { LandingPageService } from '../../services/landing-page.service';
import { environment } from '../../../../../environments/environment';

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
  generateFacebookShareLink(id: number, type: string): string {
    const url = `${window.location.origin}/landing-page/newsdetails/${id}?type=${type}`;
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
  }

  generateTwitterShareLink(id: number, type: string, text?: string): string {
    const url = `${window.location.origin}/landing-page/newsdetails/${id}?type=${type}`;
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text || '')}`;
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
