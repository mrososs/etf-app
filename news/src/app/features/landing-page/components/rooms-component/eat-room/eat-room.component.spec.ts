import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EatRoomComponent } from './eat-room.component';

describe('EatRoomComponent', () => {
  let component: EatRoomComponent;
  let fixture: ComponentFixture<EatRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EatRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
