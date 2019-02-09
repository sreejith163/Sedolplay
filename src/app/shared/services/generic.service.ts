import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError , Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ims } from '../models/ims.model';
import { AppConfigService } from './app-config.service';

@Injectable()
export class GenericService {

  private baseUrl = '';

  constructor(
    private httpClient: HttpClient,
    private environmentService: AppConfigService) {

      this.baseUrl = this.environmentService.environment['api'].sedolpay_generic;
    }

  getCurrencies(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/currency`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getCountries(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/country`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  getTimezone(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/timezone`;

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
