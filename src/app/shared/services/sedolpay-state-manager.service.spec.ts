import { TestBed, inject } from '@angular/core/testing';

import { SedolpayStateManagerService } from './sedolpay-state-manager.service';

describe('SedolpayStateManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SedolpayStateManagerService]
    });
  });

  it('should be created', inject([SedolpayStateManagerService], (service: SedolpayStateManagerService) => {
    expect(service).toBeTruthy();
  }));
});
