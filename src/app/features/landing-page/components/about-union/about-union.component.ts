import { Component, inject, OnInit } from '@angular/core';
import { Committee } from '../../models/comittess.model';
import { LandingPageService } from '../../services/landing-page.service';
import { Report } from '../../models/report.model';
import { MissionAndVision } from '../../models/MissionAndVision.model';

@Component({
  selector: 'app-about-union',
  templateUrl: './about-union.component.html',
  styleUrl: './about-union.component.scss',
})
export class AboutUnionComponent implements OnInit {
  private landingPageService = inject(LandingPageService);
  committees: Committee[] = [];
  reports: Report[] = [];
  currentLang: string = 'ar';
  missionAndVision: MissionAndVision | null = null;

  ngOnInit(): void {
    this.currentLang = localStorage.getItem('lang') || 'ar';
    this.landingPageService.getCommittees().subscribe((data) => {
      this.committees = data;
    });
    this.landingPageService.getReports().subscribe((data) => {
      this.reports = data.sort((a, b) => b.year - a.year);
    });
    this.landingPageService.getMissionAndVision().subscribe((data) => {
      this.missionAndVision = data;
    });
  }

  shouldMirrorImage(): boolean {
    return this.currentLang === 'en';
  }
}
