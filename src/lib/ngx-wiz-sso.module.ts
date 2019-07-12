import { NgModule, APP_INITIALIZER } from '@angular/core';
import { _SSOConfig, SSOConfig } from './models/sso-config';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { SSOConectorService, AuthGuard, init_app } from '../public_api';
import { HTTP_INTERCEPTORS } from '@angular/common/http/src/interceptor';
import { HttpAuthInterceptor } from './interceptors/http-auth-interceptor';

@NgModule({})
export class NgxWizSSOModule { 
  public static config: _SSOConfig = null;

  static forRoot(config: _SSOConfig): ModuleWithProviders {
    NgxWizSSOModule.config = config;
    return {
      ngModule: NgxWizSSOModule,
      providers: [
        SSOConectorService,
        AuthGuard,
        { provide: APP_INITIALIZER, useFactory: init_app, deps: [SSOConectorService], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true },
        { provide: SSOConfig, useValue: config }
      ],
    }
  }

}
