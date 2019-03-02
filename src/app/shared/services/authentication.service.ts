import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthenticationService {

  private readonly user_KEY = 'SedolPlayUser';
  private readonly custID_KEY = 'SedolPlayCustId';

  constructor(private cookieService: CookieService) { }

  isUserLogged() {
    const custId = this.cookieService.get(this.custID_KEY);
    if (custId !== null && custId !== undefined && custId.length ) {
      return true;
    }

    return false;
  }

  getUserId() {
    return this.cookieService.get(this.user_KEY);
  }

  getCustomerId() {
    return this.cookieService.get(this.custID_KEY);
  }

  setloginCookies(userId: string, custId: string) {
    this.cookieService.set(this.user_KEY, userId);
    this.cookieService.set(this.custID_KEY, custId);
  }

  logout() {
    this.cookieService.delete(this.user_KEY);
    this.cookieService.delete(this.custID_KEY);
  }
}
