import { Component, inject, OnInit } from '@angular/core';
import { TourismLegislation } from '../../models/tourism-card.model';
import { LandingPageService } from '../../services/landing-page.service';
import { StorageService } from '../../../../shared/platform/storage.service';
import { TokenExpiryService } from '../../../../core/services/token-expiry.service';
import { JwtService } from '../../../../core/services/jwt.service';

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
  isGeneralMeetingMember: boolean = false;

  private _landingService = inject(LandingPageService);
  private _storageService = inject(StorageService);
  private _tokenExpiryService = inject(TokenExpiryService);
  private _jwtService = inject(JwtService);

  ngOnInit(): void {
    // Check if user has GeneralMeetingMember role
    let role = this._storageService.getItem('user_role');

    // If role is not in localStorage but token exists, extract it from token
    if (!role) {
      const token = this._tokenExpiryService.getValidToken();
      if (token) {
        role = this._jwtService.getRoleFromToken(token);
        if (role) {
          this._storageService.setItem('user_role', role);
        }
      }
    }

    const roles = role ? role.split(',') : [];
    this.isGeneralMeetingMember = roles.some((r) =>
      ['GeneralMeetingMember', 'SysAdmin', 'GeneralAssemblyMember'].includes(r),
    );

    this.changeNewsType(this.selected); // default: قوانين
  }
  onSearchYear() {
    const year = this.enterYear.trim();
    this.filteredLegislations = this.tourismLegislations.filter((item) =>
      item.title.includes(year),
    );
  }
  changeNewsType(type: string) {
    this.selected = type;

    if (type === 'قوانين') {
      this._landingService.getLaw().subscribe({
        next: (data) => {
          // Map Law[] to TourismLegislation[]
          this.tourismLegislations = data.map((law: any) => ({
            id: law.id,
            title: law.title,
            description: law.description,
            link: law.link,
          }));
          this.filteredLegislations = this.tourismLegislations;
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
    } else if (type === 'قرارات الجمعية العمومية') {
      this._landingService.getGeneralMeetingLegislation().subscribe({
        next: (data) => {
          this.tourismLegislations = data;
          this.filteredLegislations = data;
        },
        error: (err) => console.error(err),
      });
    }
  }
}
