import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataView } from './data-view';

describe('DataView', () => {
  let component: DataView;
  let fixture: ComponentFixture<DataView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
