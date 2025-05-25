import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedNavigateButtonComponent } from './shared-navigate-button.component';

describe('SharedNavigateButtonComponent', () => {
  let component: SharedNavigateButtonComponent;
  let fixture: ComponentFixture<SharedNavigateButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedNavigateButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedNavigateButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
