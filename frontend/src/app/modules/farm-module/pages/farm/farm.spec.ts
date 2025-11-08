import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Farm } from './farm';

describe('Farm', () => {
  let component: Farm;
  let fixture: ComponentFixture<Farm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Farm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Farm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
