import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { TokenExpiryService } from '../../../../core/services/token-expiry.service';
import { LandingPageService } from '../../services/landing-page.service';
import { Training } from '../../models/training.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
})
export class TrainingComponent implements OnInit, AfterViewInit {
  translate = inject(TranslateService);
  private tokenExpiryService = inject(TokenExpiryService);
  private landingPageService = inject(LandingPageService);
  visible: boolean = false;
  isLoggedIn = false;

  translateKeys = {
    safeDriving: this.translate.instant('training.safeDriving.title'),
    dualEducation: this.translate.instant('training.dualEducation.title'),
    transition: this.translate.instant('training.transition.title'),
    cooking: this.translate.instant('training.cooking.title'),
    trainingPlatform: this.translate.instant('training.trainingPlatform.title'),
  };
  selected: string = this.translateKeys.safeDriving;
  apiTrainings: Training[] = []; // Trainings from API (only new ones not matching existing templates)
  selectedApiTraining: Training | null = null; // Currently selected API training
  matchedTrainings: {
    safeDriving?: Training;
    dualEducation?: Training;
    transition?: Training;
    cooking?: Training;
  } = {}; // Trainings that match existing static templates
  driveVideoTraining: string =
    '../../../../../assets/video/AQNpMwIm20YPg2bIVbOj_rVBFaUMZA2lIu0njwyowKbLd4fNy153Ktmt5xuehGKQzOiCoJQoSXXnbzBtQhgrVNFs.mp4';
  mainVideoSrc: string = 'assets/videos/video1.mp4';
  mainVideoPoster: string =
    '../../../../../assets/img/driveVideos/83641693482337.jpg';
  mainVideoSrc2: string = 'assets/videos/video1.mp4';
  mainVideoPoster2: string =
    '../../../../../assets/img/videos2/تدريب - دعم الانتقال الى سوق العمل .1.jpg';

  videos = [
    {
      src: 'assets/videos/video1.mp4',
      poster: '../../../../../assets/img/driveVideos/83641693482337.jpg',
    },
    {
      src: 'assets/videos/video2.mp4',
      poster:
        '../../../../../assets/img/driveVideos/Screenshot 2025-03-26 101342 1.jpg',
    },
    {
      src: 'assets/videos/video3.mp4',
      poster:
        '../../../../../assets/img/driveVideos/Screenshot 2025-03-26 101354 1.jpg',
    },
    {
      src: 'assets/videos/video4.mp4',
      poster:
        '../../../../../assets/img/driveVideos/Screenshot 2025-03-26 101409 1.jpg',
    },
  ];
  videos2 = [
    {
      src: 'assets/videos/video1.mp4',
      poster:
        '../../../../../assets/img/videos2/تدريب - دعم الانتقال الى سوق العمل .1.jpg',
    },
    {
      src: 'assets/videos/video2.mp4',
      poster:
        '../../../../../assets/img/videos2/تدريب - دعم الانتقال الى سوق العمل .2.jpg',
    },
  ];
  @ViewChild('safeMap') safeMapRef?: ElementRef<HTMLDivElement>;
  private map?: L.Map;
  private readonly center = {
    lat: environment['mapCenter']?.lat ?? 30.0444,
    lng: environment['mapCenter']?.lng ?? 31.2357,
    zoom: environment['mapCenter']?.zoom ?? 14,
  };
  private readonly maptileKey = environment['maptilerKey'] ?? '';

  ngOnInit(): void {
    // Use TokenExpiryService to check for valid token
    this.isLoggedIn = !!this.tokenExpiryService.getValidToken();

    // Load trainings from API
    this.landingPageService.getTrainings().subscribe({
      next: (trainings) => {
        this.processTrainings(trainings);
      },
      error: (err) => {
        console.error('Error loading trainings', err);
        this.apiTrainings = [];
        this.matchedTrainings = {};
      },
    });
  }

  private processTrainings(trainings: Training[]): void {
    // Get translated titles for matching
    const safeDrivingTitle = this.translate.instant('training.safeDriving.title');
    const dualEducationTitle = this.translate.instant('training.dualEducation.title');
    const transitionTitle = this.translate.instant('training.transition.title');
    const cookingTitle = this.translate.instant('training.cooking.title');

    // Reset matched trainings
    this.matchedTrainings = {};
    const newTrainings: Training[] = [];

    trainings.forEach((training) => {
      // Normalize titles for comparison (remove diacritics and normalize spaces)
      const normalizedApiTitle = this.normalizeTitle(training.title);
      const normalizedSafeDriving = this.normalizeTitle(safeDrivingTitle);
      const normalizedDualEducation = this.normalizeTitle(dualEducationTitle);
      const normalizedTransition = this.normalizeTitle(transitionTitle);
      const normalizedCooking = this.normalizeTitle(cookingTitle);

      // Match with existing templates
      // Check for Safe Driving: "القيادة الأمنة" or "القيادة الآمنة"
      if (normalizedApiTitle === normalizedSafeDriving || 
          (normalizedApiTitle.includes('قيادة') && (normalizedApiTitle.includes('أمن') || normalizedApiTitle.includes('آمن'))) ||
          training.title.includes('القيادة') && (training.title.includes('الأمنة') || training.title.includes('الآمنة'))) {
        this.matchedTrainings.safeDriving = training;
      } 
      // Check for Dual Education: "التعليم المزدوج"
      else if (normalizedApiTitle === normalizedDualEducation || 
                 (normalizedApiTitle.includes('تعليم') && normalizedApiTitle.includes('مزدوج')) ||
                 training.title.includes('التعليم المزدوج')) {
        this.matchedTrainings.dualEducation = training;
      } 
      // Check for Transition: "دعم الانتقال الي سوق العمل" or "دعم الانتقال إلى سوق العمل"
      else if (normalizedApiTitle === normalizedTransition || 
                 (normalizedApiTitle.includes('انتقال') && (normalizedApiTitle.includes('سوق') || normalizedApiTitle.includes('عمل'))) ||
                 training.title.includes('دعم الانتقال') && training.title.includes('سوق العمل')) {
        this.matchedTrainings.transition = training;
      } 
      // Check for Cooking: "فنون الطهي"
      else if (normalizedApiTitle === normalizedCooking || 
                 normalizedApiTitle.includes('طهي') || 
                 normalizedApiTitle.includes('طبخ') ||
                 training.title.includes('فنون الطهي')) {
        this.matchedTrainings.cooking = training;
      } else {
        // New training that doesn't match existing templates
        newTrainings.push(training);
      }
    });

    this.apiTrainings = newTrainings;

    // Ensure selected training exists, otherwise select first available or training platform
    this.ensureValidSelection();
  }

  private ensureValidSelection(): void {
    // If current selection doesn't exist, find first available training
    const currentSelection = this.selected;
    const isCurrentSelectionValid = 
      (currentSelection === this.translateKeys.safeDriving && this.matchedTrainings.safeDriving) ||
      (currentSelection === this.translateKeys.dualEducation && this.matchedTrainings.dualEducation) ||
      (currentSelection === this.translateKeys.transition && this.matchedTrainings.transition) ||
      (currentSelection === this.translateKeys.cooking && this.matchedTrainings.cooking) ||
      (currentSelection === this.translateKeys.trainingPlatform) ||
      (this.selectedApiTraining !== null);

    if (!isCurrentSelectionValid) {
      // Select first available training
      if (this.matchedTrainings.safeDriving) {
        this.selected = this.translateKeys.safeDriving;
      } else if (this.matchedTrainings.dualEducation) {
        this.selected = this.translateKeys.dualEducation;
      } else if (this.matchedTrainings.transition) {
        this.selected = this.translateKeys.transition;
      } else if (this.matchedTrainings.cooking) {
        this.selected = this.translateKeys.cooking;
      } else if (this.apiTrainings.length > 0) {
        this.selectApiTraining(this.apiTrainings[0]);
      } else {
        // Fallback to training platform
        this.selected = this.translateKeys.trainingPlatform;
      }
    }
  }

  private normalizeTitle(title: string): string {
    // Normalize Arabic text: remove diacritics, normalize spaces, handle common variations
    return title
      .replace(/[آأإ]/g, 'ا')
      .replace(/[ىي]/g, 'ي')
      .replace(/[ة]/g, 'ه')
      .replace(/[أآ]/g, 'ا') // Handle أ and آ variations
      .replace(/[أآ]/g, 'ا') // Handle أ and آ in different contexts
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Getters for matched training data
  getSafeDrivingTraining(): Training | null {
    return this.matchedTrainings.safeDriving || null;
  }

  getDualEducationTraining(): Training | null {
    return this.matchedTrainings.dualEducation || null;
  }

  getTransitionTraining(): Training | null {
    return this.matchedTrainings.transition || null;
  }

  getCookingTraining(): Training | null {
    return this.matchedTrainings.cooking || null;
  }

  getFormattedLink(link: string | undefined): string {
    if (!link) {
      return 'https://www.etf-rstc.org.eg';
    }
    // If link doesn't start with http:// or https://, add https://
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
      return `https://${link}`;
    }
    return link;
  }

  ngAfterViewInit(): void {
    // Small delay to ensure the map container is properly rendered
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap(): void {
    if (this.safeMapRef) {
      this.map = L.map(this.safeMapRef.nativeElement).setView(
        [this.center.lat, this.center.lng],
        this.center.zoom
      );

      L.tileLayer(
        `https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${this.maptileKey}`,
        {
          attribution:
            '© <a href="https://www.maptiler.com/">MapTiler</a> © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }
      ).addTo(this.map);

      // Fix for default marker icon
      const defaultIcon = L.icon({
        iconUrl: 'assets/leaflet/marker-icon.png',
        shadowUrl: 'assets/leaflet/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      // Add a marker for the training center
      L.marker([this.center.lat, this.center.lng], { icon: defaultIcon })
        .addTo(this.map)
        .bindPopup('المركز المصري للقيادة الآمنة')
        .openPopup();
    }
  }
  changeNewsType(type: string) {
    this.selected = type;
    this.selectedApiTraining = null; // Reset API training selection when changing to static tabs
  }

  selectApiTraining(training: Training) {
    this.selectedApiTraining = training;
    this.selected = `api-training-${training.title}`; // Unique identifier for API training
  }

  isApiTrainingSelected(): boolean {
    return this.selectedApiTraining !== null;
  }

  getTrainingImageUrl(imageLink: string): string {
    if (!imageLink) {
      return '/assets/img/blankImage.jpg';
    }

    // If it's already a complete URL, return as is
    if (imageLink.startsWith('http://') || imageLink.startsWith('https://')) {
      return imageLink;
    }

    // If it's a relative path starting with /uploads/, construct the full URL
    if (imageLink.startsWith('/uploads/')) {
      return `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net${imageLink}`;
    }

    // For other relative paths, return as is
    return imageLink;
  }

  onImageError(event: any, fallbackSrc: string = '/assets/img/blankImage.jpg'): void {
    console.warn('Image failed to load:', event.target.src);
    if (event.target.src !== fallbackSrc) {
      event.target.src = fallbackSrc;
    }
  }
  changeVideo(video: { src: string; poster: string }) {
    this.mainVideoSrc = video.src;
    this.mainVideoPoster = video.poster;

    // Auto play the video after changing
    setTimeout(() => {
      const player = document.getElementById('mainPlayer') as HTMLVideoElement;
      if (player) player.play();
    });
  }
  handleLinkClick() {
    if (this.isLoggedIn) {
      // Use TokenExpiryService to get valid token
      const token = this.tokenExpiryService.getValidToken();
      const pendingUserId = localStorage.getItem('pendingUserId');
      const pendingToken = localStorage.getItem('pendingToken');

      const lmsUrl = environment.lmsUrl;
      let urlWithParams = `${lmsUrl}?token=${token}`;

      // Add pending confirmation parameters if they exist
      if (pendingUserId && pendingToken) {
        urlWithParams += `&userId=${pendingUserId}&confirmToken=${pendingToken}`;
        // Clear the pending values after using them
        localStorage.removeItem('pendingUserId');
        localStorage.removeItem('pendingToken');
      }

      window.open(urlWithParams, '_blank');
    } else {
      this.visible = true;
    }
  }
}
