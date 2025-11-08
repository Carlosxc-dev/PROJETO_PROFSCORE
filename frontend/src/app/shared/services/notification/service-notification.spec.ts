import { TestBed } from '@angular/core/testing';

import { ServiceNotification } from './service-notification';

describe('ServiceNotification', () => {
  let service: ServiceNotification;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceNotification);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
