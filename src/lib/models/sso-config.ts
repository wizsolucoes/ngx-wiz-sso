import { InjectionToken } from "@angular/core";

export class _SSOConfig {
    public apiPath: string;
    public clientID: string;
    public grantType: string;
    public clientSecret: string;
    public scope: string;
    public authedPaths: string[];
    public apiSubscription?: string;
    public options?: SSOConfigOptions;
}


class SSOConfigOptions {
    public ssoTimeOut?: number = 60000;
    public tokenAutoRefresh?: boolean = true;
    public loginRoute?: string = 'login';
}

export const SSOConfig = new InjectionToken<_SSOConfig>("SSOConfig");