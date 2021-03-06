import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ReportService } from '../shared/services/report.service';
import { Ims } from '../../shared/models/ims.model';
import { Transfer } from '../shared/models/transfer.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { Content } from '../../shared/models/content.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { SedolpayStateManagerService } from '../../shared/services/sedolpay-state-manager.service';

declare var jsPDF: any;

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  accounts = ['All'];
  beneficiary = ['All'];
  status = ['All'];
  transfers: Array<Transfer> = [];
  allTransfers: Array<Transfer> = [];
  selectedAcNo = 'All';
  selectedBenef = 'All';
  selectedStatus = 'All';
  selectedRef: string;
  imsRequest: Ims;
  index= 1;
  imageData: string;

  columns = ['No', 'My Account', 'Timestamp', 'Payment Date', 'Reference', 'Beneficiary Name', 'Beneficiary Account',
             'Amount', 'Currency', 'Status', 'Comments'];
  rows = [];


  _startDate = null;
  _endDate = null;

  newArray = (len) => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  }

  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  }

  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  }

  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() >= this._endDate.getTime();
  }

  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() <= this._startDate.getTime();
  }

  get _isSameDay() {
    return this._startDate && this._endDate && moment(this._startDate).isSame(this._endDate, 'day');
  }

  get _endTime() {
    return {
      nzHideDisabledOptions: true,
      nzDisabledHours: () => {
        return this._isSameDay ? this.newArray(this._startDate.getHours()) : [];
      },
      nzDisabledMinutes: (h) => {
        if (this._isSameDay && h === this._startDate.getHours()) {
          return this.newArray(this._startDate.getMinutes());
        }
        return [];
      },
      nzDisabledSeconds: (h, m) => {
        if (this._isSameDay && h === this._startDate.getHours() && m === this._startDate.getMinutes()) {
          return this.newArray(this._startDate.getSeconds());
        }
        return [];
      }
    };
  }

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private sedolpayStateManagerService: SedolpayStateManagerService,
    private reportService: ReportService) { }

  ngOnInit() {
    this.loadPayments();
  }

  filter() {
    this.transfers = this.allTransfers;
    if (this.selectedRef !== undefined) {
      this.transfers = this.transfers.filter(i =>
        i.transRef.toLowerCase().indexOf(this.selectedRef.toLowerCase()) > -1);
    }
    if (this.selectedAcNo !== undefined && this.selectedAcNo !== 'All') {
      const acNo = this.selectedAcNo.split('-')[1];
      this.transfers = this.transfers.filter(i =>
        i.orderCustomer.accNo.toLowerCase().indexOf(acNo.toLowerCase()) > -1);
    }
    if (this.selectedBenef !== undefined && this.selectedBenef !== 'All') {
      this.transfers = this.transfers.filter(i =>
        i.benef.name.toLowerCase().indexOf(this.selectedBenef.toLowerCase()) > -1);
    }
    if (this.selectedStatus !== undefined && this.selectedStatus !== 'All') {
      this.transfers = this.transfers.filter(i =>
        i.status.toLowerCase().indexOf(this.selectedStatus.toLowerCase()) > -1);
    }
  }

  search() {
    let fromDate = null;
    let toDate = null;

    if (this._startDate !== null) {
      const startDate = new Date(this._startDate.toString());
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
      const startDay = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate();
      fromDate = startMonth.toString() + startDay.toString() + startYear.toString();
    }

    if (this._endDate !== null) {
      const endDate = new Date(this._endDate.toString());
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : (endDate.getMonth() + 1) ;
      const endDay = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate();
      toDate = endMonth.toString() + endDay.toString() + endYear.toString();
    }

    this.imsRequest.ims.content.dataheader.fromDate = fromDate !== null ? fromDate : '';
    this.imsRequest.ims.content.dataheader.toDate = toDate !== null ? toDate : '';
    this.reportService.getPaymentStatusReport(this.imsRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined) {
        this.transfers = data.ims.content.data.transfer;
        this.allTransfers = Object.assign(this.allTransfers, this.transfers);
        this.setAccountsAndBeneficiaryAndStatus(this.transfers);
        this.resetSelectedValues();
      }
    });
  }

  downloadPdf() {
    const doc = new jsPDF('p', 'pt');

    this.transfers.forEach(transfer => {
      const row = [];
      row.push(this.index);
      row.push(transfer.orderCustomer.accNo + '-' + transfer.orderCustomer.cur);
      row.push(transfer.timestamp);
      row.push(transfer.payDate);
      row.push(transfer.transRef);
      row.push(transfer.benef.name);
      row.push(transfer.benef.accNo);
      row.push(transfer.payAmt);
      row.push(transfer.payCur);
      row.push(transfer.status);
      row.push(transfer.comments);
      this.rows.push(row);
      this.index = this.index + 1;
    });
    doc.autoTable(this.columns, this.rows, {
      theme: 'striped',
      styles: {
        fontSize: 5.3,
        columnWidth: 'wrap'
      },
      headerStyles: { color: 'white', fontStyle: 'bold', fillColor: [190, 32, 106] },
      margin: { top: 100, right: 30}
    });

    doc.setFontSize(18);
    doc.text('Payment Status', 40, 60);
    doc.addImage(this.imageData, 'JPEG', 440, 40, 95, 20);
    doc.setFontSize(9);
    doc.text('Generated by: ' + this.sedolpayStateManagerService.getUserName(),
             470 - (this.sedolpayStateManagerService.getUserName().length * 4.1), 75);
    doc.setFontSize(8);
    doc.text('Generated at: ' + this.clientTimezone(), 395, 90);

    doc.save('Belight_Payment Status');
  }

  private loadPayments() {
    this.imsRequest = this.getImsRequestFormat();
    this.reportService.getPaymentStatusReport(this.imsRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined) {
        this.transfers = data.ims.content.data.transfer;
        this.allTransfers = Object.assign(this.allTransfers, this.transfers);
        this.setAccountsAndBeneficiaryAndStatus(this.transfers);
        this.loadImageDetails();
      }
    });
  }

  private setAccountsAndBeneficiaryAndStatus(transfers: Array<Transfer>) {
    this.transfers.forEach(trans => {
      const accountNoIndex = this.accounts.indexOf(trans.orderCustomer.cur + '-' + trans.orderCustomer.accNo);
      if (accountNoIndex === -1) {
        this.accounts.push(trans.orderCustomer.cur + '-' + trans.orderCustomer.accNo);
      }
      const benefIndex = this.beneficiary.indexOf(trans.benef.name);
      if (benefIndex === -1) {
        this.beneficiary.push(trans.benef.name);
      }
      const statusIndex = this.status.indexOf(trans.status);
      if (statusIndex === -1) {
        this.status.push(trans.status);
      }
    });
  }

  private loadImageDetails() {
    this.getBase64ImageFromUrl('assets/img/logo.png')
    .then(result => this.imageData = result.toString())
    .catch(err => console.error(err));
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('2', 'PAY_STATUS', 'VIEW', this.getUserTimezone());
    const dataHeader = new DataHeader(this.getCustomerId());
    dataHeader.txnCnt = '30';
    dataHeader.fromDate = '';
    dataHeader.toDate = '';
    dataHeader.payBatchId = '';
    const dataContent = new DataContent();
    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private resetSelectedValues() {
    this.selectedRef = undefined;
    this.selectedAcNo = 'All';
    this.selectedBenef = 'All';
    this.selectedStatus = 'All';
  }

  private getCustomerId(): any {
    const custId = this.authenticationService.getCustomerId();
    if (custId !== null && custId !== undefined && custId !== '') {
      return custId;
    } else {
      this.router.navigate(['login']);
    }
  }

  private async getBase64ImageFromUrl(imageUrl) {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader  = new FileReader();
      reader.addEventListener('load', function () {
          resolve(reader.result);
      }, false);

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  private clientTimezone(): string {
    const offset = this.getUserTimezone();
    return new Date().toLocaleString('en-US', { timeZone: offset });
  }

  private getUserTimezone(): any {
    const usertimeZone = this.authenticationService.getUserTimezone();
    if (usertimeZone !== null && usertimeZone !== undefined && usertimeZone !== '') {
      return usertimeZone;
    } else {
      this.router.navigate(['login']);
    }
  }
}
