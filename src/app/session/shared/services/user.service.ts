import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError , Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ims } from '../../../shared/models/ims.model';

@Injectable()
export class UserService {

  private baseUrl = 'http://103.35.198.115:7019/ecsservice/service/customerportal';

  constructor(private httpClient: HttpClient) { }

  login(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/custAuth`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  register(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/signup`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  validateEmail(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/validateuser`;

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
