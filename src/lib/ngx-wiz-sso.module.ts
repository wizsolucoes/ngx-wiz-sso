import { NgModule, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { _SSOConfig, SSOConfig } from './models/sso-config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpAuthInterceptor } from './interceptors/http-auth-interceptor';
import { SSOConectorService, init_app } from './services/sso-conector.service';
import { AuthGuard } from './guards/auth-guard';

@NgModule({})
export class NgxWizSSOModule {
  static forRoot(config: _SSOConfig): ModuleWithProviders<NgxWizSSOModule> {
    return {
      ngModule: NgxWizSSOModule,
      providers: [
        SSOConectorService,
        AuthGuard,
        {
          provide: APP_INITIALIZER,
          useFactory: init_app,
          deps: [SSOConectorService],
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpAuthInterceptor,
          multi: true,
        },
        { provide: SSOConfig, useValue: config },
      ],
    };
  }
}
