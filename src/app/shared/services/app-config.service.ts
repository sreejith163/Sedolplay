import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

@Injectable()
export class AppConfigService {

  private configUrl = 'assets/config/config.json';
  public environment: any;

  constructor(
    private httpService: Http) {}

  loadConfiguration() {
    return new Promise((resolve, reject) => {
      this.httpService
        .get(this.configUrl)
        .map((res: any) => res.json())
        .catch((error: any) => {
          resolve(true);
          return Observable.throw(error.json().error || 'Server error');
        })
        .subscribe((envResponse: any) => {
          this.environment = envResponse;
          resolve(true);
        });
    });
  }
}
