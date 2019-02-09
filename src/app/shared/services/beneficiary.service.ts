import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError as observableThrowError , Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ims } from '../models/ims.model';

@Injectable()
export class BeneficiaryService {

  private baseUrl = 'http://103.35.198.115:7019/ecsservice/service/customerportal';

  constructor(private httpClient: HttpClient) { }

  getBeneficiaryDetails(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/benefdtls`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  addBeneficiaryDetails(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/upbenefdtls`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  updateBeneficiaryDetails(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/upbenefdtls`;

    return this.httpClient.post(url, JSON.stringify(request)).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  deleteBeneficiaryDetails(request: Ims): Observable<Ims> {
    const url = `${this.baseUrl}/upbenefdtls`;
    const sd = JSON.stringify(request);

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
