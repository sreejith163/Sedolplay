import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthenticationService {

  private readonly custID_KEY = 'SedolPlayCustId';

  constructor(private cookieService: CookieService) { }

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
    this.cookieService.delete(this.custID_KEY);
  }
}
