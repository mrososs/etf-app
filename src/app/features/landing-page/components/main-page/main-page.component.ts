import { Component, inject, OnInit } from '@angular/core';
import { GroupMember } from '../../models/group.model';
import { LandingPageService } from '../../services/landing-page.service';
import { TreeNode } from 'primeng/api';
import { NewsItem } from '../../models/news.model';
import { forkJoin, BehaviorSubject, Observable } from 'rxjs';
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

  // Loading states
  isLoadingNews = false;
  isLoadingTourismNews = false;
  newsError: string | null = null;
  tourismNewsError: string | null = null;

  // Pagination properties
  currentPage: number = 0;
  itemsPerPage: number = 3;
  totalPages: number = 0;

  // Cache for loaded news
  private newsCache = new Map<string, any[]>();
  private isInitialLoad = true;

  private _landingPageService = inject(LandingPageService);
  // private _platformService = inject(PlatformService);
  private _imagePreloadService = inject(ImagePreloadService);
  ngOnInit(): void {
    // Preload critical images
    this._imagePreloadService.preloadCriticalImages();

    // Load members first (static data)
    this._landingPageService.getGroupMembers().subscribe({
      next: (members) => {
        this.members = members;
        this._imagePreloadService.preloadMemberImages(this.members);
      },
      error: (err) => {
        console.error('Error loading members', err);
      },
    });

    // Load initial news (أخبار عن الإتحاد)
    this.loadNewsData('أخبار عن الإتحاد');
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
    this.loadNewsData(type);
  }

  /**
   * Load news data based on type with caching and error handling
   */
  loadNewsData(type: string): void {
    // Check cache first
    if (this.newsCache.has(type)) {
      this.setNewsData(type, this.newsCache.get(type)!);
      return;
    }

    // Set loading state
    if (type === 'أخبار عن الإتحاد') {
      this.isLoadingNews = true;
      this.newsError = null;
    } else {
      this.isLoadingTourismNews = true;
      this.tourismNewsError = null;
    }

    // Load data from API
    const newsObservable =
      type === 'أخبار عن الإتحاد'
        ? this._landingPageService.getNewsItems()
        : this._landingPageService.getTourismNews();

    newsObservable.subscribe({
      next: (data) => {
        // Cache the data
        this.newsCache.set(type, data);

        // Set the data and update display
        this.setNewsData(type, data);

        // Preload images for better performance
        this._imagePreloadService.preloadNewsImages(data);

        // Clear loading state
        if (type === 'أخبار عن الإتحاد') {
          this.isLoadingNews = false;
        } else {
          this.isLoadingTourismNews = false;
        }
      },
      error: (err) => {
        console.error(`Error loading ${type}:`, err);

        // Set error state
        if (type === 'أخبار عن الإتحاد') {
          this.isLoadingNews = false;
          this.newsError = 'فشل في تحميل أخبار الإتحاد';
        } else {
          this.isLoadingTourismNews = false;
          this.tourismNewsError = 'فشل في تحميل أخبار السياحة';
        }
      },
    });
  }

  /**
   * Set news data and update display
   */
  private setNewsData(type: string, data: any[]): void {
    if (type === 'أخبار عن الإتحاد') {
      this.newsItems = data;
    } else {
      this.tourismNews = data;
    }
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

  /**
   * Handle image loading errors with fallback
   */
  onImageError(
    event: any,
    fallbackSrc: string = '/assets/img/blankImage.jpg'
  ): void {
    console.warn('Image failed to load:', event.target.src);
    if (event.target.src !== fallbackSrc) {
      event.target.src = fallbackSrc;
    }
  }

  /**
   * Handle image loading success
   */
  onImageLoad(event: any): void {
    // Add loaded class for styling
    event.target.classList.add('loaded');
    console.log('Image loaded successfully:', event.target.src);
  }

  /**
   * Get loading state for current news type
   */
  get isLoadingCurrentNews(): boolean {
    return this.selected === 'أخبار عن الإتحاد'
      ? this.isLoadingNews
      : this.isLoadingTourismNews;
  }

  /**
   * Get error message for current news type
   */
  get currentNewsError(): string | null {
    return this.selected === 'أخبار عن الإتحاد'
      ? this.newsError
      : this.tourismNewsError;
  }

  /**
   * Get complete image URL for news items
   */
  getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
      return '/assets/img/blankImage.jpg';
    }

    // If it's already a complete URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative path starting with /uploads/, construct the full URL
    if (imageUrl.startsWith('/uploads/')) {
      const fullUrl = `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net${imageUrl}`;
      console.log('Constructed image URL:', fullUrl);
      return fullUrl;
    }

    // For other relative paths, assume they're asset paths
    return imageUrl;
  }
}
