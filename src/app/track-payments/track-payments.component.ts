import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { TrackPaymentService } from '../shared/services/track-payment.service';
import { Ims } from '../models/ims.model';
import { Header } from '../models/header.model';
import { DataHeader } from '../models/data-header.model';
import { DataContent } from '../models/data-content.model';
import { Content } from '../models/content.model';
import { RequestResponse } from '../models/request-response.model';
import { Transfer } from '../models/transfer-track-payments/transfer.model';


@Component({
  selector: 'app-track-payments',
  templateUrl: './track-payments.component.html',
  styleUrls: ['./track-payments.component.scss']
})
export class TrackPaymentsComponent implements OnInit {
  accounts = ['All'];
  beneficiary = ['All'];
  transfers: Array<Transfer> = [];
  allTransfers: Array<Transfer> = [];
  selectedAcNo = 'All';
  selectedBenef = 'All';
  selectedStatus = 'All';
  selectedRef: string;
  imsRequest: Ims;

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

  constructor(private trackPaymentService: TrackPaymentService) { }

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
    this.trackPaymentService.getPaymentTracks(this.imsRequest).subscribe((data: Ims) => {
      this.transfers = data.ims.content.data.transfer;
      this.allTransfers = Object.assign(this.allTransfers, this.transfers);
      this.setAccountsAndBeneficiary(this.transfers);
      this.resetSelectedValues();
    });
  }

  private loadPayments() {
    this.imsRequest = this.getImsRequestFormat();
    this.trackPaymentService.getPaymentTracks(this.imsRequest).subscribe((data: Ims) => {
      this.transfers = data.ims.content.data.transfer;
      this.allTransfers = Object.assign(this.allTransfers, this.transfers);
      this.setAccountsAndBeneficiary(this.transfers);
    });
  }

  private setAccountsAndBeneficiary(transfers: Array<Transfer>) {
    this.transfers.forEach(trans => {
      const accountNoIndex = this.accounts.indexOf(trans.orderCustomer.cur + '-' + trans.orderCustomer.accNo);
      if (accountNoIndex === -1) {
        this.accounts.push(trans.orderCustomer.cur + '-' + trans.orderCustomer.accNo);
      }
      const benefIndex = this.beneficiary.indexOf(trans.benef.name);
      if (benefIndex === -1) {
        this.beneficiary.push(trans.benef.name);
      }
    });
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('2', 'TRACK_PAY', 'VIEW', 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
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
  }
}
