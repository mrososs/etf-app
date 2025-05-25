import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutUnionComponent } from './about-union.component';

describe('AboutUnionComponent', () => {
  let component: AboutUnionComponent;
  let fixture: ComponentFixture<AboutUnionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutUnionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutUnionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
