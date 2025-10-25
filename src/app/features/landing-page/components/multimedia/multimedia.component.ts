import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-multimedia',
  templateUrl: './multimedia.component.html',
  styleUrls: ['../../../../../assets/styles/partiel/_multimedia.scss'],
})
export class MultimediaComponent implements OnInit {
  selectedCategory: string = 'all';
  currentLang: string = 'ar';
  showHeroContent: boolean = true;
  showVideoOverlay: boolean = true;
  safeVideoUrl!: SafeResourceUrl;
  videoStarted: boolean = false;
  isMuted: boolean = true; // Start muted by default

  private sanitizer = inject(DomSanitizer);

  @ViewChild('heroVideo', { static: false })
  heroVideo!: ElementRef<HTMLVideoElement>;

  categories = [
    { key: 'all', label: 'multimedia.categories.all' },
    { key: 'awareness', label: 'multimedia.categories.awareness' },
    { key: 'events', label: 'multimedia.categories.events' },
    { key: 'gallery', label: 'multimedia.categories.gallery' },
  ];

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'ar';
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

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    // Category selection logic can be added here if needed
    console.log('Selected category:', category);
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
