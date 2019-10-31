import { Injectable, EventEmitter, Inject } from '@angular/core';
import SSOConector from '@wizsolucoes/vanilla-wiz-sso';
import { Observable, from } from 'rxjs';
import { Token } from '../models/token';
import { SSOConfig, _SSOConfig } from '../models/sso-config';

@Injectable({
  providedIn: 'root'
})
export class SSOConectorService {

  private sso: SSOConector;
  public static readonly onRefreshTokenFail: EventEmitter<void> = new EventEmitter();

  constructor(@Inject(SSOConfig) config : _SSOConfig) {    
    this.sso = new SSOConector(config);
    SSOConector.onAutoRefreshFail = () => {
      this.sso.logOut();
      SSOConectorService.onRefreshTokenFail.emit()
    };
  }

  public static isLogged(): Token {
    return SSOConector.getToken();
  }

  public logOut(): void {
    return this.sso.logOut();
  }

  public loginWithCredentials(_credentials: { userName: string, password: string }): Observable<Token> {
    return <Observable<Token>> from(this.sso.loginWithCredentials(_credentials.userName, _credentials.password));
  }

  public refreshToken(): Observable<Token> {
    return <Observable<Token>> from(this.sso.refreshToken());
  }

  public checkLogged(): Observable<Token> {
    
    return <Observable<Token>> from(this.sso.isLogged());
  }

}

export const init_app = (ssoConectorService: SSOConectorService)  => () => new Promise(
  (resolve) => {
    ssoConectorService.checkLogged()
      .subscribe(
        token => resolve(token),
        _ => resolve()
      );
  }
);
