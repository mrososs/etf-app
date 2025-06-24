import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupMember } from '../models/group.model';
import { NewsItem } from '../models/news.model';
import { Committee } from '../models/comittess.model';
import { Report } from '../models/report.model';
import { TourismNews } from '../models/tourism-news.model';
import { TourismLegislation } from '../models/tourism-card.model';
import { Law } from '../models/law.model';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private http = inject(HttpClient);
  constructor() {}
  getGroupMembers(): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>('/assets/data/group-members.json');
  }
  getNewDetails(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>('/assets/data/news.json');
  }
  getNewsItems(): Observable<NewsItem[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<NewsItem[]>(
      `http://etfapi.itechpro-eg.com/api/News?lang=${lang}`
    );
  }
  getContactUs(data: any): Observable<any> {
    return this.http.post<any>(
      `http://etfapi.itechpro-eg.com/api/ContactUs`,
      data
    );
  }
  getCommittees(): Observable<Committee[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Committee[]>(
      `http://etfapi.itechpro-eg.com/api/Commitee/${lang}`
    );
  }

  getReports(): Observable<Report[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Report[]>(
      `http://etfapi.itechpro-eg.com/api/Report?lang=${lang}`
    );
  }
  getTourismNews(): Observable<TourismNews[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<TourismNews[]>(
      `http://etfapi.itechpro-eg.com/api/TourismNews?lang=${lang}`
    );
  }
  getTourismLegislations(): Observable<TourismLegislation[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<TourismLegislation[]>(
      `http://etfapi.itechpro-eg.com/api/TourismLegislation?lang=${lang}`
    );
  }
  getLaw(): Observable<Law[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Law[]>(
      `http://etfapi.itechpro-eg.com/api/Law/${lang}`
    );
  }
}
