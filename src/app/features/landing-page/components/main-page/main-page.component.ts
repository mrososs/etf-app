import { Component, inject, OnInit } from '@angular/core';
import { GroupMember } from '../../models/group.model';
import { LandingPageService } from '../../services/landing-page.service';
import { TreeNode } from 'primeng/api';
import { NewsItem } from '../../models/news.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  selected: string = 'أخبار عن الإتحاد'; // ✅ لازم تتعرف هنا
  isExpanded = false;
  members: GroupMember[] = [];
  newsItems: NewsItem[] = [];

  private _landingPageService = inject(LandingPageService);
  ngOnInit(): void {
    forkJoin({
      members: this._landingPageService.getGroupMembers(),
      news: this._landingPageService.getNewsItems(),
    }).subscribe({
      next: ({ members, news }) => {
        this.members = members;
        this.newsItems = news;
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }
  toggleText() {
    this.isExpanded = !this.isExpanded;
  }
}
