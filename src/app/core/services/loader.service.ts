import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private requestCount = 0;
  public loading$ = new BehaviorSubject<boolean>(false);

  show() {
    this.requestCount++;
    if (this.requestCount === 1) {
      this.loading$.next(true);
    }
  }

  hide() {
    if (this.requestCount > 0) {
      this.requestCount--;
    }
    if (this.requestCount === 0) {
      this.loading$.next(false);
    }
  }
}
