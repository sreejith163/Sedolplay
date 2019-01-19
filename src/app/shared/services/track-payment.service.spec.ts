import { TestBed, inject } from '@angular/core/testing';

import { TrackPaymentService } from './track-payment.service';

describe('TrackPaymentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackPaymentService]
    });
  });

  it('should be created', inject([TrackPaymentService], (service: TrackPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
