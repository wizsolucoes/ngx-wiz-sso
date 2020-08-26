import { TestBed, inject } from "@angular/core/testing";

import SSOConector from "@wizsolucoes/vanilla-wiz-sso";
import { SSOConectorService } from "./sso-conector.service";

import { NgxWizSSOModule } from "../ngx-wiz-sso.module";
import { ssoConfig } from "../../../testing/fake_sso_config";
import { token } from "../../../testing/fake_token";

describe("SsoConectorService", () => {
  let service: SSOConectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxWizSSOModule.forRoot(ssoConfig)],
    });

    service = TestBed.inject(SSOConectorService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should instantiate sso when constucted", () => {
    expect(service.sso).toBeTruthy();
  });

  it("#isLogged calls SSOConector.getToken", () => {
    // Given
    spyOn(SSOConector, "getToken");

    // When
    SSOConectorService.isLogged();

    // Then
    expect(SSOConector.getToken).toHaveBeenCalled();
  });

  it("#logOut calls sso.logOut", () => {
    // Given
    spyOn(service.sso, "logOut");

    // When
    service.logOut();

    // Then
    expect(service.sso.logOut).toHaveBeenCalled();
  });

  it("#loginWithCredentials returns token after calling sso.loginWithCredentials", () => {
    // Given
    const credentials = { userName: "string", password: "string" };
    spyOn(service.sso, "loginWithCredentials").and.returnValue(
      Promise.resolve(token)
    );

    // When
    const observable = service.loginWithCredentials(credentials);

    // Then
    expect(service.sso.loginWithCredentials).toHaveBeenCalledWith(
      credentials.userName,
      credentials.password
    );

    observable.subscribe((data) => {
      expect(data).toEqual(jasmine.objectContaining(token));
    });
  });

  it("#refreshToken returns token after calling sso.refreshToken", () => {
    // Given
    spyOn(service.sso, "refreshToken").and.returnValue(Promise.resolve(token));

    // When
    const observable = service.refreshToken();

    // Then
    expect(service.sso.refreshToken).toHaveBeenCalled();

    observable.subscribe((data) => {
      expect(data).toEqual(jasmine.objectContaining(token));
    });
  });

  it("#checkLogged returns token after calling sso.isLogged", () => {
    // Given
    spyOn(service.sso, "isLogged").and.returnValue(Promise.resolve(token));

    // When
    const observable = service.checkLogged();

    // Then
    expect(service.sso.isLogged).toHaveBeenCalled();

    observable.subscribe((data) => {
      expect(data).toEqual(jasmine.objectContaining(token));
    });
  });
});
