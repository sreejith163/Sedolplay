import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmailRequest } from '../models/email-request.model';
import { AppConfigService } from './app-config.service';

@Injectable()
export class EmailService {

  private baseUrl = '';

  constructor(
    private httpClient: HttpClient,
    private environmentService: AppConfigService) {

      this.baseUrl = this.environmentService.environment['api'].emailapi;
    }

  sendMail(request: EmailRequest): Observable<any> {
    const url = `${this.baseUrl}`;

    return this.httpClient.post(url, request).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  private extractData(response: Response) {
    return response !== undefined && response !== null  ?  response : {};
  }

  private handleError(error: Response): Observable<any> {
    if (error.status === 200) {
      return observableOf(200);
    }
    return observableThrowError(error || 'Server error');
  }
}
