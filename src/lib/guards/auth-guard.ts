import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot  } from "@angular/router";
import { Observable } from "rxjs";
import { SSOConectorService } from "../services/sso-conector.service";

export class AuthGuard implements CanActivate {

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return !!SSOConectorService.isLogged();
    }    

}