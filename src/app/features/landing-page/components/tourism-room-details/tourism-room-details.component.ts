import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  TourismRoom,
  TourismRoomService,
} from '../../../../core/services/tourism-room.service';
import { LangService } from '../../../../core/services/lang.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-tourism-room-details',
  templateUrl: './tourism-room-details.component.html',
  styleUrls: ['./tourism-room-details.component.scss'],
})
export class TourismRoomDetailsComponent implements OnInit {
  room: TourismRoom | null = null;
  apiUrl = environment.apiBaseUrl;

  getVisitWebsiteTranslationKey(title: string | undefined): string {
    if (!title) return 'hotelroom.visitWebsite'; // default fallback

    // Mapping the Arabic titles to their respective translation keys
    if (title.includes('الغوص')) return 'divingroom.visitWebsite';
    if (title.includes('المنشآت والمطاعم')) return 'eatroom.visitWebsite';
    if (title.includes('المنشآت الفندقية')) return 'hotelroom.visitWebsite';
    if (title.includes('العاديات والسلع')) return 'productroom.visitWebsite';
    if (title.includes('شركات ووكالات')) return 'travelroom.visitWebsite';

    // Mapping the English titles (just in case)
    if (title.includes('Diving')) return 'divingroom.visitWebsite';
    if (title.includes('Restaurants')) return 'eatroom.visitWebsite';
    if (title.includes('Hotels')) return 'hotelroom.visitWebsite';
    if (title.includes('Commodities')) return 'productroom.visitWebsite';
    if (title.includes('Travel')) return 'travelroom.visitWebsite';

    return 'hotelroom.visitWebsite';
  }

  private route = inject(ActivatedRoute);
  private tourismRoomService = inject(TourismRoomService);
  private langService = inject(LangService);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            // Ideally we would have getOne endpoint, but user said "get the information from endpoint and show it".
            // The endpoint returns a list. So I must fetch the list and find the item by ID.
            // Or maybe I should assume I need to call the list endpoint and filter locally.
            return this.tourismRoomService.getTourismRooms(
              this.langService.currentLang,
            );
          }
          return of([]);
        }),
      )
      .subscribe((rooms) => {
        const title = this.route.snapshot.paramMap.get('id');
        this.room = rooms.find((r) => r.title === title) || null;
        if (this.room) {
          this.room.imageLink = this.apiUrl + this.room.imageLink;
        }
      });
  }
}
