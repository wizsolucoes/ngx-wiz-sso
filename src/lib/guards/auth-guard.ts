import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router  } from "@angular/router";
import { Observable, config } from "rxjs";
import { SSOConectorService } from "../services/sso-conector.service";
import { Inject } from "@angular/core";
import { SSOConfig, _SSOConfig } from "../models/sso-config";

export class AuthGuard implements CanActivate {

    constructor(private router: Router, @Inject(SSOConfig) private config: _SSOConfig){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if( !SSOConectorService.isLogged() ) {
            const urlLogin: string = this.config.options.loginRoute ? this.config.options.loginRoute : 'login';
            this.router.navigate([urlLogin]);
            return false;
        }
        return true;
    }    

}