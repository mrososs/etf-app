import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivingRoomComponent } from './diving-room.component';

describe('DivingRoomComponent', () => {
  let component: DivingRoomComponent;
  let fixture: ComponentFixture<DivingRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DivingRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivingRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
