import { Injectable } from '@angular/core';
import { CookiesStorageService } from 'ngx-store';

@Injectable()
export class AuthenticationService {

  private readonly custID_KEY = 'SedolPlayCustId';

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

  setloginCookies(custId: string) {
    this.cookieService.set(this.custID_KEY, custId);
  }

  logout() {
    this.cookieService.remove(this.custID_KEY);
  }
}
