import { Component, inject, OnInit } from '@angular/core';
import { GroupMember } from '../../models/group.model';
import { LandingPageService } from '../../services/landing-page.service';
import { TreeNode } from 'primeng/api';
import { NewsItem } from '../../models/news.model';
import { forkJoin } from 'rxjs';
import { TourismNews } from '../../models/tourism-news.model';
// import { PlatformService } from '../../../shared/platform/platform.service';
import { ImagePreloadService } from '../../../../shared/services/image-preload.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  selected: string = 'أخبار عن الإتحاد'; // ✅ لازم تتعرف هنا
  isExpanded = false;
  members: GroupMember[] = [];
  newsItems: NewsItem[] = [];
  tourismNews: TourismNews[] = [];
  displayedNews: NewsItem[] | TourismNews[] = [];

  // Pagination properties
  currentPage: number = 0;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  private _landingPageService = inject(LandingPageService);
  // private _platformService = inject(PlatformService);
  private _imagePreloadService = inject(ImagePreloadService);
  ngOnInit(): void {
    // Preload critical images
    this._imagePreloadService.preloadCriticalImages();

    forkJoin({
      members: this._landingPageService.getGroupMembers(),
      news: this._landingPageService.getNewsItems(),
      tourismNews: this._landingPageService.getTourismNews(),
    }).subscribe({
      next: ({ members, news, tourismNews }) => {
        this.members = members;
        this.newsItems = news;
        this.tourismNews = tourismNews;

        // Preload member and news images
        this._imagePreloadService.preloadMemberImages(this.members);
        this._imagePreloadService.preloadNewsImages(this.newsItems);
        this._imagePreloadService.preloadNewsImages(this.tourismNews);

        this.updateDisplayedNews();
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  generateFacebookShareLink(id: number, type: string): string {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://etf-egypt.com';
    const url = `${origin}/landing-page/newsdetails/${id}?type=${type}`;
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
  }

  generateTwitterShareLink(id: number, type: string, text?: string): string {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://etf-egypt.com';
    const url = `${origin}/landing-page/newsdetails/${id}?type=${type}`;
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text || '')}`;
  }

  changeNewsType(type: string) {
    this.selected = type;
    this.currentPage = 0; // Reset to first page when changing news type
    this.updateDisplayedNews();
  }

  // Pagination methods
  updateDisplayedNews() {
    const sourceArray =
      this.selected === 'أخبار عن الإتحاد' ? this.newsItems : this.tourismNews;
    this.totalPages = Math.ceil(sourceArray.length / this.itemsPerPage);

    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedNews = sourceArray.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedNews();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedNews();
    }
  }

  // Helper methods for pagination state
  canGoNext(): boolean {
    return this.currentPage < this.totalPages - 1;
  }

  canGoPrevious(): boolean {
    return this.currentPage > 0;
  }

  // دالة مساعدة لتحسين alt text للصور
  getImageAlt(name: string): string {
    return `صورة ${name}`;
  }
}
