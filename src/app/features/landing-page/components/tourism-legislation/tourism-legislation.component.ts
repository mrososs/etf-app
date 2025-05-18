import { Component, inject, OnInit } from '@angular/core';
import { TourismLegislation } from '../../models/tourism-card.model';
import { LandingPageService } from '../../services/landing-page.service';

@Component({
  selector: 'app-tourism-legislation',
  templateUrl: './tourism-legislation.component.html',
  styleUrl: './tourism-legislation.component.scss',
})
export class TourismLegislationComponent implements OnInit {
  enterYear: string = '';
  selected: string = 'قوانين';
  tourismLegislations: TourismLegislation[] = [];
  filteredLegislations: TourismLegislation[] = [];

  private _landingService = inject(LandingPageService);

  ngOnInit(): void {
    this.changeNewsType(this.selected); // default: قوانين
  }
  onSearchYear() {
    const year = this.enterYear.trim();
    this.filteredLegislations = this.tourismLegislations.filter((item) =>
      item.title.includes(year)
    );
  }
  changeNewsType(type: string) {
    this.selected = type;

    if (type === 'قوانين') {
      this._landingService.getLaw().subscribe({
        next: (data) => {
          this.tourismLegislations = data;
          this.filteredLegislations = data;
        },
        error: (err) => console.error(err),
      });
    } else if (type === 'قرارات وزارية') {
      this._landingService.getTourismLegislations().subscribe({
        next: (data) => {
          this.tourismLegislations = data;
          this.filteredLegislations = data;
        },
        error: (err) => console.error(err),
      });
    }
  }
}
