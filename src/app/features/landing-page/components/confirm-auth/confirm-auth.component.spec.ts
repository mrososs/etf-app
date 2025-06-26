import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmAuthComponent } from './confirm-auth.component';

describe('ConfirmAuthComponent', () => {
  let component: ConfirmAuthComponent;
  let fixture: ComponentFixture<ConfirmAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmAuthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
