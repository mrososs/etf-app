import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarusolGalleryComponent } from './carusol-gallery.component';

describe('CarusolGalleryComponent', () => {
  let component: CarusolGalleryComponent;
  let fixture: ComponentFixture<CarusolGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarusolGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarusolGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
