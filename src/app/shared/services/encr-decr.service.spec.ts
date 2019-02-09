import { TestBed, inject } from '@angular/core/testing';

import { EncrDecrService } from './encr-decr.service';

describe('EncrDecrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EncrDecrService]
    });
  });

  it('should be created', inject([EncrDecrService], (service: EncrDecrService) => {
    expect(service).toBeTruthy();
  }));
});
