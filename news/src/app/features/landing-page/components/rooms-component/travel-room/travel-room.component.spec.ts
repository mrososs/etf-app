import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelRoomComponent } from './travel-room.component';

describe('TravelRoomComponent', () => {
  let component: TravelRoomComponent;
  let fixture: ComponentFixture<TravelRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TravelRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
