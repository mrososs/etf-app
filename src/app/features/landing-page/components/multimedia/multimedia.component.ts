import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LandingPageService } from '../../services/landing-page.service';
import {
  MediaCenterItem,
  MediaCenterResponse,
} from '../../models/media-center.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['../../../../../assets/styles/partiel/_multimedia.scss'],
})
export class MultimediaComponent implements OnInit, OnDestroy {
  selectedCategory: string = 'all';
  currentLang: string = 'ar';
  showHeroContent: boolean = true;
  showVideoOverlay: boolean = true;
  safeVideoUrl!: SafeResourceUrl;
  videoStarted: boolean = false;
  isMuted: boolean = true; // Start muted by default
  isLoading: boolean = false;

  // Media Center Data
  events: MediaCenterItem[] = [];
  albums: MediaCenterItem[] = [];
  activities: MediaCenterItem[] = [];
  displayedItems: MediaCenterItem[] = [];

  // Cache for YouTube embed URLs to prevent infinite calls
  private readonly youtubeEmbedCache = new Map<
    string,
    SafeResourceUrl | null
  >();
  private subscription: Subscription | null = null;
  private isDataLoaded: boolean = false;

  private readonly sanitizer = inject(DomSanitizer);
  private readonly landingService = inject(LandingPageService);

  @ViewChild('heroVideo', { static: false })
  heroVideo!: ElementRef<HTMLVideoElement>;

  categories = [
    { key: 'all', label: 'multimedia.categories.all' },
    { key: 'events', label: 'multimedia.categories.events' },
    { key: 'albums', label: 'multimedia.categories.gallery' },
    { key: 'activities', label: 'multimedia.categories.awareness' },
  ];

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'ar';
    this.initializeVideo();
    this.loadMediaCenterData();

    // Hide hero content after 3 seconds with smooth transition
    setTimeout(() => {
      this.showHeroContent = false;
      this.startVideo();
    }, 3000);

    // Hide video overlay after 4.5 seconds to show video clearly
    setTimeout(() => {
      this.showVideoOverlay = false;
    }, 4500);
  }

  loadMediaCenterData(): void {
    // Prevent multiple simultaneous calls (only if already loading)
    if (this.isLoading) {
      console.log('Media center data is already loading, skipping...');
      return;
    }

    // Unsubscribe from previous subscription if exists
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    console.log('Loading media center data...');
    this.isLoading = true;
    this.subscription = this.landingService.getMediaCenter().subscribe({
      next: (response: MediaCenterResponse) => {
        console.log('Media center data loaded:', response);
        this.events = response.events || [];
        this.albums = response.albums || [];
        this.activities = response.activities || [];
        // Clear cache when new data is loaded
        this.youtubeEmbedCache.clear();
        this.filterByCategory(this.selectedCategory);
        this.isLoading = false;
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.error('Error loading media center data:', error);
        this.isLoading = false;
        this.isDataLoaded = false;
      },
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    // Clear cache
    this.youtubeEmbedCache.clear();
  }

  initializeVideo(): void {
    // Use local video from assets - initially muted and paused
    const localVideoUrl = 'assets/video/3-dr khaled.mp4';
    this.safeVideoUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(localVideoUrl);
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;

    switch (category) {
      case 'events':
        this.displayedItems = this.events;
        break;
      case 'albums':
        this.displayedItems = this.albums;
        break;
      case 'activities':
        this.displayedItems = this.activities;
        break;
      case 'all':
      default:
        this.displayedItems = [
          ...this.events,
          ...this.albums,
          ...this.activities,
        ];
        break;
    }
  }

  getTitle(item: MediaCenterItem): string {
    return this.currentLang === 'ar' ? item.title.value : item.titleEn.value;
  }

  getDescription(item: MediaCenterItem): string {
    return this.currentLang === 'ar'
      ? item.descriptionAr.value
      : item.description.value;
  }

  getLink(item: MediaCenterItem): string {
    return item.link.value;
  }

  isVideo(item: MediaCenterItem): boolean {
    return item.type.value === 1; // 1 = video, 0 = image
  }

  isImage(item: MediaCenterItem): boolean {
    return item.type.value === 0; // 0 = image, 1 = video
  }

  /**
   * Check if the link is a YouTube URL
   */
  isYouTubeUrl(url: string): boolean {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
  }

  /**
   * Extract YouTube video ID from various YouTube URL formats
   */
  getYouTubeVideoId(url: string): string | null {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(url);
      if (match?.[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get YouTube embed URL (cached to prevent infinite calls)
   */
  getYouTubeEmbedUrl(url: string): SafeResourceUrl | null {
    // Check cache first
    if (this.youtubeEmbedCache.has(url)) {
      return this.youtubeEmbedCache.get(url)!;
    }

    const videoId = this.getYouTubeVideoId(url);
    if (!videoId) {
      this.youtubeEmbedCache.set(url, null);
      return null;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.youtubeEmbedCache.set(url, safeUrl);
    return safeUrl;
  }

  /**
   * Get YouTube thumbnail URL
   */
  getYouTubeThumbnail(url: string): string | null {
    const videoId = this.getYouTubeVideoId(url);
    if (!videoId) return null;

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  onVideoError(): void {
    console.log('Video failed to load, using fallback background');
  }

  onVideoLoaded(): void {
    console.log('Video loaded successfully');
  }

  startVideo(): void {
    this.videoStarted = true;
    // Manually start the video
    if (this.heroVideo) {
      this.heroVideo.nativeElement.play().catch((error) => {
        console.log('Autoplay failed:', error);
      });
    }
    console.log('Video should start playing now');
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.heroVideo) {
      this.heroVideo.nativeElement.muted = this.isMuted;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/blankImage.jpg';
  }

  /**
   * TrackBy function for *ngFor to prevent unnecessary re-renders
   */
  trackByItem(index: number, item: MediaCenterItem): string {
    return item.link.value + item.type.value;
  }
}
