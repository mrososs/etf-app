import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourismLegislationComponent } from './tourism-legislation.component';

describe('TourismLegislationComponent', () => {
  let component: TourismLegislationComponent;
  let fixture: ComponentFixture<TourismLegislationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TourismLegislationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourismLegislationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
