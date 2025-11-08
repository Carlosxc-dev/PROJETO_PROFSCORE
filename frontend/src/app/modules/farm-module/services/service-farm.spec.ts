import { TestBed } from '@angular/core/testing';
import { ServiceFarm } from './service-farm';


describe('ServiceFarm', () => {
  let service: ServiceFarm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceFarm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
