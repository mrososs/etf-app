import { Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
})
export class TrainingComponent implements OnInit {
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
  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
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
