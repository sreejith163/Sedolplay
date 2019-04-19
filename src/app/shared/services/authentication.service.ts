import { Injectable } from '@angular/core';
import { CookiesStorageService } from 'ngx-store';

@Injectable()
export class AuthenticationService {

  private readonly custID_KEY = 'SedolPlayCustId';
  private readonly timeZone_KEY = 'SedolPlayCustId';

  constructor(
    private cookieService: CookiesStorageService) { }

  isUserLogged() {
    const custId = this.cookieService.get(this.custID_KEY);
    if (custId !== null && custId !== undefined && custId.length ) {
      return true;
    }

    return false;
  }

  getCustomerId() {
    return this.cookieService.get(this.custID_KEY);
  }

  getUserTimezone() {
    return this.cookieService.get(this.timeZone_KEY);
  }

  setloginCookies(custId: string) {
    this.cookieService.set(this.custID_KEY, custId);
  }

  setUserTimezone(timezone: string) {
    this.cookieService.set(this.timeZone_KEY, timezone);
  }

  logout() {
    this.cookieService.remove(this.custID_KEY);
  }
}
