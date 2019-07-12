import { TestBed, inject } from '@angular/core/testing';

import { SSOConectorService } from './sso-conector.service';

describe('SsoConectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SSOConectorService]
    });
  });

  it('should be created', inject([SSOConectorService], (service: SSOConectorService) => {
    expect(service).toBeTruthy();
  }));
});
