import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Email } from '../models/email.model';
import { EmailRequest } from '../models/email-request.model';
import { EmailTemplateParams } from '../models/email-template-params.model';

@Injectable()
export class EmailService {

  private baseUrl = 'https://api.emailjs.com/api/v1.0/email/send';

  constructor(private httpClient: HttpClient) { }

  sendMail(email: Email): Observable<any> {
    const url = `${this.baseUrl}`;
    const request = this.getEmailRequest(email);

    return this.httpClient.post(url, request).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  private getEmailRequest(email: Email): EmailRequest {
    const emailRequest = new EmailRequest();
    emailRequest.service_id = 'sedolplay_mail';
    emailRequest.template_id = 'template_NTrcOOzK';
    emailRequest.user_id = 'user_r1g6gTm4EE5wXwXzxqtEn';
    emailRequest.template_params = new EmailTemplateParams();
    emailRequest.template_params.message = email.message;
    emailRequest.template_params.name = email.firstName + ' ' + email.lastName;
    emailRequest.template_params.reply_email = 'sreejith.jith09@gmail.com';
    return emailRequest;
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
