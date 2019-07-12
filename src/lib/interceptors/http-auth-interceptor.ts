import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SSOConectorService } from '../services/sso-conector.service';
import { SSOConfig, _SSOConfig } from '../models/sso-config';
import { Inject } from '@angular/core';

export class HttpAuthInterceptor implements HttpInterceptor {

    constructor(@Inject(SSOConfig) private config: _SSOConfig) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = SSOConectorService.isLogged();
        if (!!token) {
            let isAuthedService: boolean = false;

            this.config.authedPaths.forEach(
                r => {
                    if( req.url.indexOf(r) != -1 ) {
                        isAuthedService = true;
                        return;
                    }
                }
            )

            if (isAuthedService) {
                const dupReq = req.clone({
                    headers: req.headers.set('Authorization', `${token.tokenType} ${token.hash}`)
                });
                return next.handle(dupReq);
            }
            return next.handle(req);

        }

        return next.handle(req);
    }
    
}