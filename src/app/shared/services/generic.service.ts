import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError , Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ims } from '../models/ims.model';

@Injectable()
export class GenericService {

  private baseUrl = 'http://103.35.198.115:7019/ecsservice/service/generic';

  constructor(private httpClient: HttpClient) { }

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
