import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { types } from '../model/types.model';

@Injectable({
  providedIn: 'root',
})
export class HomePageService {
  private _http = inject(HttpClient);
  getTypes(): Observable<types[]> {
    return this._http.get<types[]>('../../../../assets/data/types.data.json');
  }
}
