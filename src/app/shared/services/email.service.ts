import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EmailRequest } from '../models/email-request.model';

@Injectable()
export class EmailService {

  private baseUrl = 'https://api.emailjs.com/api/v1.0/email/send';

  constructor(private httpClient: HttpClient) { }

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
