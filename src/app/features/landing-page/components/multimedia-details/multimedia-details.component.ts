import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MultimediaItem, MultimediaVideo } from '../../models/multimedia.model';
import { LandingPageService } from '../../services/landing-page.service';

@Component({
  selector: 'app-multimedia-details',
  templateUrl: './multimedia-details.component.html',
  styleUrl: './multimedia-details.component.scss',
})
export class MultimediaDetailsComponent implements OnInit, OnDestroy {
  multimediaItem: MultimediaItem | undefined;
  currentVideo: MultimediaVideo | undefined;
  currentVideoIndex: number = 0;
  currentLang: string = 'ar';
  isLoading: boolean = true;
  safeVideoUrl: SafeResourceUrl | undefined;

  private landingService = inject(LandingPageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'ar';
    this.loadMultimediaItem();
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions if needed
  }

  loadMultimediaItem(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.landingService.getMultimediaItemById(+id).subscribe({
        next: (item) => {
          if (item) {
            this.multimediaItem = item;
            this.currentVideo = item.videos?.[0];
            this.currentVideoIndex = 0;
            this.updateVideoUrl();
            this.isLoading = false;
          } else {
            this.router.navigate(['/landing-page/multimedia']);
          }
        },
        error: (error) => {
          console.error('Error loading multimedia item:', error);
          this.router.navigate(['/landing-page/multimedia']);
        },
      });
    } else {
      this.router.navigate(['/landing-page/multimedia']);
    }
  }

  selectVideo(video: MultimediaVideo, index: number): void {
    this.currentVideo = video;
    this.currentVideoIndex = index;
    this.updateVideoUrl();
  }

  updateVideoUrl(): void {
    if (this.currentVideo) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${this.currentVideo.videoId}?rel=0&modestbranding=1&autoplay=1`
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

  getLocalizedVideoTitle(video: MultimediaVideo): string {
    return this.currentLang === 'ar' ? video.title.ar : video.title.en;
  }

  getTypeLabel(type: string): string {
    return `multimedia.${type}`;
  }

  getCategoryLabel(category: string): string {
    return `multimedia.categories.${category}`;
  }

  generateShareLink(): string {
    const url = `${window.location.origin}/landing-page/multimedia/${this.multimediaItem?.id}`;
    return url;
  }

  generateFacebookShareLink(): string {
    const url = this.generateShareLink();
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
  }

  generateTwitterShareLink(): string {
    const url = this.generateShareLink();
    const text = this.multimediaItem
      ? this.getLocalizedTitle(this.multimediaItem)
      : '';
    return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
  }

  generateWhatsAppShareLink(): string {
    const url = this.generateShareLink();
    const text = this.multimediaItem
      ? this.getLocalizedTitle(this.multimediaItem)
      : '';
    return `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/img/blankImage.jpg';
  }
}
