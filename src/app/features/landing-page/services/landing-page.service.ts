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
import { Login } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { forgetPasswordModel } from '../models/forgetpassword.model';
import { ResetPasswordModel } from '../models/token.model';

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
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Auth/forget-password`,
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
    return this.http.get<GroupMember[]>('/assets/data/group-members.json');
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
  getContactUs(data: any): Observable<any> {
    return this.http.post<any>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/ContactUs`,
      data
    );
  }
  getCommittees(): Observable<Committee[]> {
    const lang = localStorage.getItem('lang') || 'ar';
    return this.http.get<Committee[]>(
      `https://etf-gtfrcrf9gaaceacg.centralus-01.azurewebsites.net/api/Commitee/${lang}`
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
}
