import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GroupMember } from '../models/group.model';
import { NewsItem } from '../models/news.model';
import { Committee } from '../models/comittess.model';
import { Report } from '../models/report.model';
import { TourismNews } from '../models/tourism-news.model';
import { TourismLegislation } from '../models/tourism-card.model';
import { Law } from '../models/law.model';
import { Login } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { forgetPasswordModel } from '../models/forgetpassword.model';
import { ResetPasswordModel } from '../models/token.model';
import { MissionAndVision } from '../models/MissionAndVision.model';
import { MultimediaItem } from '../models/multimedia.model';
import { Training } from '../models/training.model';
import { MediaCenterResponse } from '../models/media-center.model';

@Injectable({
  providedIn: 'root',
})
export class LandingPageService {
  private http = inject(HttpClient);
  constructor() {}
  login(data: Login): Observable<string> {
    return this.http.post<string>(
      'https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Auth/login',
      data,
      { responseType: 'text' as 'json' } // الحل هنا
    );
  }
  forgetPassword(data: forgetPasswordModel): Observable<any> {
    return this.http.post<any>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Auth/forgot-password`,
      data
    );
  }
  resetPassword(data: ResetPasswordModel): Observable<any> {
    return this.http.post<any>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Auth/reset-password`,
      data
    );
  }
  register(data: RegisterModel): Observable<any> {
    return this.http.post<any>(
      'https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Auth/register',
      data
    );
  }
  getGroupMembers(): Observable<GroupMember[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<GroupMember[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/GroupMember/${lang}`
    );
  }
  getNewDetails(): Observable<NewsItem[]> {
    return this.http.get<NewsItem[]>('/assets/data/news.json');
  }
  getNewsItems(): Observable<NewsItem[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<NewsItem[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/News?lang=${lang}`
    );
  }

  getNewsItemById(id: number): Observable<NewsItem> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<NewsItem>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/News/${id}?lang=${lang}`
    );
  }
  getContactUs(data: any): Observable<any> {
    return this.http.post<any>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/ContactUs`,
      data
    );
  }
  getCommittees(): Observable<Committee[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    console.log(lang);
    return this.http.get<Committee[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Commitee/${lang}`
    );
  }
  getMissionAndVision(): Observable<MissionAndVision> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<MissionAndVision>(`
      https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Content/MissionAndVision/${lang}
      `);
  }
  getCEOWord(): Observable<{ value: string }> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<{ value: string }>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Content/CEOWord/${lang}`
    );
  }
  getReports(): Observable<Report[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Report[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Report?lang=${lang}`
    );
  }
  getTourismNews(): Observable<TourismNews[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<TourismNews[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/TourismNews?lang=${lang}`
    );
  }

  getTourismNewsById(id: number): Observable<TourismNews> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<TourismNews>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/TourismNews/${id}?lang=${lang}`
    );
  }
  getTourismLegislations(): Observable<TourismLegislation[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<TourismLegislation[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/TourismLegislation?lang=${lang}`
    );
  }
  getLaw(): Observable<Law[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Law[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Law/${lang}`
    );
  }

  getMultimediaItems(): Observable<MultimediaItem[]> {
    return this.http.get<MultimediaItem[]>('/assets/data/multimedia.json');
  }

  getMultimediaItemById(id: number): Observable<MultimediaItem | undefined> {
    return this.getMultimediaItems().pipe(
      map((items) => items.find((item) => item.id === id))
    );
  }

  getTrainings(): Observable<Training[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Training[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Content/Trainings/${lang}`
    );
  }

  getGeneralMeetingLegislation(): Observable<TourismLegislation[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<TourismLegislation[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/GeneralMeetingLegislation?lang=${lang}`
    );
  }

  getMediaCenter(): Observable<MediaCenterResponse> {
    return this.http.get<MediaCenterResponse>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/MediaCenter`
    );
  }
}
