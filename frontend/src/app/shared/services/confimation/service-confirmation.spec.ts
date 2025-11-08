import { TestBed } from '@angular/core/testing';

import { ServiceConfirmation } from './service-confirmation';

describe('ServiceConfirmation', () => {
  let service: ServiceConfirmation;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceConfirmation);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
