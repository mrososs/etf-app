import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactUsBannerComponent } from './contact-us-banner.component';

describe('ContactUsBannerComponent', () => {
  let component: ContactUsBannerComponent;
  let fixture: ComponentFixture<ContactUsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactUsBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactUsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
