import { Component, inject, OnInit } from '@angular/core';
import { GroupMember } from '../../models/group.model';
import { LandingPageService } from '../../services/landing-page.service';
import { TreeNode } from 'primeng/api';
import { NewsItem } from '../../models/news.model';
import { forkJoin } from 'rxjs';
import { TourismNews } from '../../models/tourism-news.model';

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
  tourismNews: TourismNews[] = [];
  displayedNews: NewsItem[] | TourismNews[] = [];

  private _landingPageService = inject(LandingPageService);
  ngOnInit(): void {
    forkJoin({
      members: this._landingPageService.getGroupMembers(),
      news: this._landingPageService.getNewsItems(),
      tourismNews: this._landingPageService.getTourismNews(),
    }).subscribe({
      next: ({ members, news, tourismNews }) => {
        this.members = members;
        this.newsItems = news;
        this.tourismNews = tourismNews;
        this.displayedNews = news.slice(0, 3) || tourismNews.slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading data', err);
      },
    });
  }
  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  changeNewsType(type: string) {
    this.selected = type;

    if (type === 'أخبار عن الإتحاد') {
      this.displayedNews = this.newsItems.slice(0, 3);
    } else if (type === 'أخبار السياحة') {
      this.displayedNews = this.tourismNews.slice(0, 3);
    }
  }
}
