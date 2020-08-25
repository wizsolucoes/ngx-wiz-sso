import { TestBed, inject } from '@angular/core/testing';

import { SSOConectorService } from './sso-conector.service';

import { NgxWizSSOModule } from '../ngx-wiz-sso.module';
import { ssoConfig } from '../../../testing/fake_sso_config';

describe('SsoConectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[NgxWizSSOModule.forRoot(ssoConfig)],
      providers: [SSOConectorService]
    });
  });

  it('should be created', inject([SSOConectorService], (service: SSOConectorService) => {
    expect(service).toBeTruthy();
  }));
});
