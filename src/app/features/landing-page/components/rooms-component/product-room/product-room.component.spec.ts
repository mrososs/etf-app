import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRoomComponent } from './product-room.component';

describe('ProductRoomComponent', () => {
  let component: ProductRoomComponent;
  let fixture: ComponentFixture<ProductRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
