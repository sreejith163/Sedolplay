import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError , Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ims } from '../../../shared/models/ims.model';
import { AppConfigService } from '../../../shared/services/app-config.service';

@Injectable()
export class UserService {

  private baseUrl = '';

  constructor(
    private httpClient: HttpClient,
    private environmentService: AppConfigService) {

      this.baseUrl = this.environmentService.environment['api'].sedolpay;
    }

  login(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/custAuth`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  register(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/signup`;
    console.log(JSON.stringify(request));

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  activate(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/createacc`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  validateCustId(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/validatecustid`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  validateUserId(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/validateuser`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  validateEmail(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/validateemail`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  resetPassword(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/updatepass`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  private extractData(response: Response) {
    return response !== undefined && response !== null  ?  response : {};
  }

  private handleError(error: Response): Observable<any> {
    return observableThrowError(error || 'Server error');
  }
}
