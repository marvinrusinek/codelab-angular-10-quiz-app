import { TestBed } from '@angular/core/testing';

import { SyncRegistrationService } from './sync-registration.service';

describe('SyncRegistrationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SyncRegistrationService = TestBed.get(SyncRegistrationService);
    expect(service).toBeTruthy();
  });
});
