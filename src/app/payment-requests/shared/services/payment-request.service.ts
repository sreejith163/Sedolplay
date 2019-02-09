import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError , Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ims } from '../../../shared/models/ims.model';
import { AppConfigService } from '../../../shared/services/app-config.service';

@Injectable()
export class PaymentRequestService {

  private baseUrl = '';

  constructor(
    private httpClient: HttpClient,
    private environmentService: AppConfigService) {

      this.baseUrl = this.environmentService.environment['api'].sedolpay;
    }

  getPaymentViews(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/payview`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  transferPayment(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/payments`;

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
