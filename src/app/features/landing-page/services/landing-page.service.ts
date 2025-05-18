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
  getNewsItems(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>('/assets/data/news.json');
  }
  getCommittees(): Observable<Committee[]> {
    return this.http.get<Committee[]>('assets/data/committees.json');
  }

  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>('/assets/data/reports.json');
  }
  getTourismNews(): Observable<TourismNews[]> {
  return this.http.get<TourismNews[]>('assets/data/tourism-news.json');
}
getTourismLegislations(): Observable<TourismLegislation[]> {
  return this.http.get<TourismLegislation[]>('/assets/data/tourism-legislation.json');
}
getLaw():Observable<Law[]>{
  return this.http.get<Law[]>('/assets/data/law.json');
}

}
