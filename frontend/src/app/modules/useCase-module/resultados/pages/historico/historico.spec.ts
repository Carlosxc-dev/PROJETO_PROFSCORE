import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayResults } from './display-results';

describe('DisplayResults', () => {
  let component: DisplayResults;
  let fixture: ComponentFixture<DisplayResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
