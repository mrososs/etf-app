import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  MultimediaItem,
  GalleryImage,
  YouTubeVideo,
} from '../../models/multimedia.model';
import { LandingPageService } from '../../services/landing-page.service';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['../../../../../assets/styles/partiel/_multimedia.scss'],
})
export class MultimediaComponent implements OnInit {
  multimediaItems: MultimediaItem[] = [];
  filteredItems: MultimediaItem[] = [];
  selectedCategory: string = 'all';
  currentLang: string = 'ar';
  isLoading: boolean = true;
  showHeroContent: boolean = true;
  showVideoOverlay: boolean = true;
  safeVideoUrl!: SafeResourceUrl;
  videoStarted: boolean = false;
  isMuted: boolean = true; // Start muted by default

  private landingService = inject(LandingPageService);
  private sanitizer = inject(DomSanitizer);

  @ViewChild('heroVideo', { static: false })
  heroVideo!: ElementRef<HTMLVideoElement>;

  categories = [
    { key: 'all', label: 'multimedia.categories.all' },
    { key: 'training', label: 'multimedia.categories.training' },
    { key: 'awareness', label: 'multimedia.categories.awareness' },
    { key: 'events', label: 'multimedia.categories.events' },
    { key: 'gallery', label: 'multimedia.categories.gallery' },
  ];

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'ar';
    this.loadMultimediaItems();
    this.initializeVideo();

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

  initializeVideo(): void {
    // Use local video from assets - initially muted and paused
    const localVideoUrl = 'assets/video/3-dr khaled.mp4';
    this.safeVideoUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(localVideoUrl);
  }

  loadMultimediaItems(): void {
    this.isLoading = true;
    this.landingService.getMultimediaItems().subscribe({
      next: (data) => {
        this.multimediaItems = data;
        this.filteredItems = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading multimedia items:', error);
        this.isLoading = false;
      },
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    if (category === 'all') {
      this.filteredItems = this.multimediaItems;
    } else {
      this.filteredItems = this.multimediaItems.filter(
        (item) => item.category === category
      );
    }
  }

  getLocalizedTitle(item: MultimediaItem): string {
    return this.currentLang === 'ar' ? item.title.ar : item.title.en;
  }

  getLocalizedDescription(item: MultimediaItem): string {
    return this.currentLang === 'ar'
      ? item.description.ar
      : item.description.en;
  }

  getTypeLabel(type: string): string {
    return `multimedia.${type}`;
  }

  getVideosCountText(count: number): string {
    return `${count} ${this.currentLang === 'ar' ? 'فيديو' : 'video'}`;
  }

  getImagesCountText(count: number): string {
    return `${count} ${this.currentLang === 'ar' ? 'صورة' : 'image'}`;
  }

  getYouTubeCountText(count: number): string {
    return `${count} ${
      this.currentLang === 'ar' ? 'مقطع يوتيوب' : 'YouTube video'
    }`;
  }

  getTotalContentCount(item: MultimediaItem): number {
    let count = 0;
    if (item.videos) count += item.videos.length;
    if (item.images) count += item.images.length;
    if (item.youtubeVideos) count += item.youtubeVideos.length;
    return count;
  }

  getContentCountText(item: MultimediaItem): string {
    const totalCount = this.getTotalContentCount(item);
    return `${totalCount} ${this.currentLang === 'ar' ? 'عنصر' : 'item'}`;
  }

  getOverlayIcon(type: string): string {
    switch (type) {
      case 'gallery':
        return 'pi pi-images';
      case 'youtube':
        return 'pi pi-youtube';
      case 'video':
      case 'playlist':
        return 'pi pi-play';
      case 'course':
        return 'pi pi-book';
      default:
        return 'pi pi-play';
    }
  }

  getMetaIcon(type: string): string {
    switch (type) {
      case 'gallery':
        return 'pi pi-images';
      case 'youtube':
        return 'pi pi-youtube';
      case 'video':
      case 'playlist':
        return 'pi pi-video';
      case 'course':
        return 'pi pi-book';
      default:
        return 'pi pi-video';
    }
  }

  getActionButtonText(type: string): string {
    switch (type) {
      case 'gallery':
        return 'multimedia.viewGallery';
      case 'youtube':
        return 'multimedia.watchYoutube';
      case 'video':
      case 'playlist':
      case 'course':
      default:
        return 'multimedia.watchNow';
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/blankImage.jpg';
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
}
