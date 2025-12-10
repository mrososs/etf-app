import { Component, inject, OnInit, OnDestroy } from '@angular/core';
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
export class MainPageComponent implements OnInit, OnDestroy {
  selected: string = 'أخبار عن الإتحاد'; // ✅ لازم تتعرف هنا
  isExpanded = false;
  members: GroupMember[] = [];
  headMember: GroupMember | undefined; // Member with order 0
  regularMembers: GroupMember[] = []; // Members with order 1+
  ceoWord: string = ''; // CEO/Head word from API
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

  // Auto-pagination properties
  private autoPaginationInterval: any;
  private isHovered: boolean = false;
  private readonly AUTO_PAGINATION_DELAY = 5000; // 5 seconds

  // Cache for loaded news
  private newsCache = new Map<string, any[]>();
  private isInitialLoad = true;

  private _landingPageService = inject(LandingPageService);
  // private _platformService = inject(PlatformService);
  private _imagePreloadService = inject(ImagePreloadService);
  ngOnInit(): void {
    // Preload critical images
    this._imagePreloadService.preloadCriticalImages();

    // Load members from API and sort by order
    this._landingPageService.getGroupMembers().subscribe({
      next: (members) => {
        // Separate head (order 0) from regular members (order 1+)
        const sorted = this.sortMembersByOrder(members);
        this.members = sorted;
        this.headMember = sorted.find((m) => {
          const order =
            typeof m.order === 'string'
              ? Number.parseInt(m.order, 10)
              : m.order || 999;
          return order === 0;
        });
        this.regularMembers = sorted.filter((m) => {
          const order =
            typeof m.order === 'string'
              ? Number.parseInt(m.order, 10)
              : m.order || 999;
          return order !== 0;
        });
        this._imagePreloadService.preloadMemberImages(this.members);
      },
      error: (err) => {
        console.error('Error loading members', err);
        // Fallback: initialize with empty array to prevent template errors
        this.members = [];
        this.headMember = undefined;
        this.regularMembers = [];
      },
    });

    // Load CEO/Head word from API
    this._landingPageService.getCEOWord().subscribe({
      next: (response) => {
        this.ceoWord = response.value || '';
      },
      error: (err) => {
        console.error('Error loading CEO word', err);
        // Fallback: use empty string or keep default
        this.ceoWord = '';
      },
    });

    // Load initial news (أخبار عن الإتحاد)
    this.loadNewsData('أخبار عن الإتحاد');
  }

  /**
   * Sort members by order field:
   * - order 0 (or "0") = Head/Manager -> should be at index 0
   * - order 1+ (or "1", "2", etc.) = Regular members -> should be at index 1, 2, 3, etc.
   */
  private sortMembersByOrder(members: GroupMember[]): GroupMember[] {
    if (!members || members.length === 0) {
      return [];
    }

    // Separate head (order 0) from regular members (order 1+)
    const head: GroupMember[] = [];
    const regularMembers: GroupMember[] = [];

    members.forEach((member) => {
      const order = member.order;
      // Convert order to number for comparison (handle both string and number)
      const orderNum =
        typeof order === 'string' ? Number.parseInt(order, 10) : order || 999;

      if (orderNum === 0) {
        head.push(member);
      } else {
        regularMembers.push(member);
      }
    });

    // Sort regular members by order (ascending)
    regularMembers.sort((a, b) => {
      const orderA =
        typeof a.order === 'string'
          ? Number.parseInt(a.order, 10)
          : a.order || 999;
      const orderB =
        typeof b.order === 'string'
          ? Number.parseInt(b.order, 10)
          : b.order || 999;
      return orderA - orderB;
    });

    // Combine: head first (index 0), then regular members (index 1+)
    return [...head, ...regularMembers];
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

    // Start auto-pagination if there are multiple pages
    if (this.totalPages > 1) {
      this.startAutoPagination();
    } else {
      this.stopAutoPagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateDisplayedNews();
    } else {
      // Loop back to first page
      this.currentPage = 0;
      this.updateDisplayedNews();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedNews();
    } else {
      // Loop to last page
      this.currentPage = this.totalPages - 1;
      this.updateDisplayedNews();
    }
  }

  // Auto-pagination methods
  startAutoPagination() {
    this.stopAutoPagination(); // Clear any existing interval
    this.autoPaginationInterval = setInterval(() => {
      if (!this.isHovered && this.totalPages > 1) {
        this.nextPage();
      }
    }, this.AUTO_PAGINATION_DELAY);
  }

  stopAutoPagination() {
    if (this.autoPaginationInterval) {
      clearInterval(this.autoPaginationInterval);
      this.autoPaginationInterval = null;
    }
  }

  onNewsHover() {
    this.isHovered = true;
  }

  onNewsLeave() {
    this.isHovered = false;
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

  /**
   * Get complete image URL for member images
   * Handles both /uploads/ paths and asset paths
   */
  getMemberImageUrl(imageUrl: string | undefined): string {
    if (!imageUrl) {
      return '/assets/img/blankImage.jpg';
    }

    // If it's already a complete URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // If it's a relative path starting with /uploads/, construct the full URL
    if (imageUrl.startsWith('/uploads/')) {
      return `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net${imageUrl}`;
    }

    // For other relative paths (like assets/), assume they're asset paths and return as is
    return imageUrl;
  }

  /**
   * Get member order as number (for CSS class naming)
   */
  getMemberOrder(member: GroupMember): number {
    const order = member.order;
    return typeof order === 'string'
      ? Number.parseInt(order, 10)
      : order || 999;
  }

  /**
   * TrackBy function for ngFor performance optimization
   */
  trackByOrder(index: number, member: GroupMember): string | number {
    return member.order || index;
  }

  ngOnDestroy(): void {
    this.stopAutoPagination();
  }
}
