import { Component } from '@angular/core';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.scss',
})
export class TrainingComponent {
  selected: string = 'القيادة الامنة';
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
}
