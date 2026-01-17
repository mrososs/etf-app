import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TourismRoom {
  id: string;
  title: string;
  description: string;
  imageLink: string;
  link: string;
}

@Injectable({
  providedIn: 'root',
})
export class TourismRoomService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiBaseUrl;

  getTourismRooms(language: string): Observable<TourismRoom[]> {
    return this.http.get<TourismRoom[]>(
      `${this.apiUrl}/api/TourismRoom/${language}`,
    );
  }
}
