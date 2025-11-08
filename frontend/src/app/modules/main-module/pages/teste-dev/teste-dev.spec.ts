import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteDev } from './teste-dev';

describe('TesteDev', () => {
  let component: TesteDev;
  let fixture: ComponentFixture<TesteDev>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteDev]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TesteDev);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
