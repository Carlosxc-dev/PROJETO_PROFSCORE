import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Metric } from './metric';

describe('Metric', () => {
  let component: Metric;
  let fixture: ComponentFixture<Metric>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Metric]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Metric);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
