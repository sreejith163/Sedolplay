import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthenticationService {

  private readonly user_KEY = 'SedolPlayUser';
  private readonly custID_KEY = 'SedolPlayCustId';
  private isLoggedIn: Boolean = true;

  constructor(private cookieService: CookieService) { }

  isUserLogged() {
    return this.isLoggedIn;
  }

  getUserId() {
    return this.cookieService.get(this.user_KEY);
  }

  getCustomerId() {
    return this.cookieService.get(this.custID_KEY);
  }

  setloginCookies(userId: string, custId: string) {
    this.isLoggedIn  = true;
    this.cookieService.set(this.user_KEY, userId);
    this.cookieService.set(this.custID_KEY, custId);
  }

  logout() {
    this.isLoggedIn  = false;
    this.cookieService.deleteAll();
  }
}
