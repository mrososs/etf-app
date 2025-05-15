import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GroupMember } from '../models/group.model';
import { NewsItem } from '../models/news.model';

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
}
