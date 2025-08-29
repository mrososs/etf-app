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
import * as L from 'leaflet';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
})
export class TrainingComponent implements OnInit, AfterViewInit {
  translate = inject(TranslateService);
  visible: boolean = false;
  isLoggedIn = false;

  translateKeys = {
    safeDriving: this.translate.instant('training.safeDriving.title'),
    dualEducation: this.translate.instant('training.dualEducation.title'),
    transition: this.translate.instant('training.transition.title'),
    cooking: this.translate.instant('training.cooking.title'),
  };
  selected: string = this.translateKeys.safeDriving;
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
    this.isLoggedIn = !!localStorage.getItem('auth_token');
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
      const token = localStorage.getItem('auth_token');
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
