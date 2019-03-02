import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AccountService } from '../shared/services/account.service';
import { KeyValue } from '../../shared/models/key-value.model';
import { Ims } from '../../shared/models/ims.model';
import { Statement } from '../../manage-accounts/shared/models/statement.model';
import { StatementAccount } from '../shared/models/statement-account.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { Content } from '../../shared/models/content.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { SedolpayStateManagerService } from '../../shared/services/sedolpay-state-manager.service';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrls: ['./statements.component.scss']
})
export class StatementsComponent implements OnInit {
  type = [
    { value: 'All', label: 'All' },
    { value: 'Transactions', label: 'Transactions' }
  ];
  countries: KeyValue[];
  accounts: Array<any> = [];
  allAccounts: Array<any> = [];
  imsRequest: Ims;
  statements: Array<Statement> = [];
  selectedAccount: string;

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
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
    private router: Router,
    private sedolpayStateManagerService: SedolpayStateManagerService) { }

  ngOnInit() {
    this.getStatements();
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
      const endMonth = endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : (endDate.getMonth() + 1);
      const endDay = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate();
      toDate = endMonth.toString() + endDay.toString() + endYear.toString();
    }

    this.imsRequest.ims.content.dataheader.fromDate = fromDate !== null ? fromDate : '';
    this.imsRequest.ims.content.dataheader.toDate = toDate !== null ? toDate : '';
    this.accountService.getStatements(this.imsRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined) {
        this.accounts = data.ims.content.data.accounts;
      }
    });
  }

  filter(searchText: string) {
    if (searchText !== undefined) {
      this.accounts = this.allAccounts.filter(i =>
        i.accNo.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
    }
  }

  onAccountClicked(account: StatementAccount) {
    this.statements = account.stmt;
    this.selectedAccount = account.accNo;
    this.scrollToStatements();
  }

  private scrollToStatements() {
    const element = document.getElementById('statementElement');
    if (element !== undefined && element !== null) {
      window.scrollTo(0, element.offsetTop);
    }
  }

  private getCustomerId(): any {
    const custId = this.authenticationService.getCustomerId();
    if (custId !== null && custId !== undefined && custId !== '') {
      return custId;
    } else {
      this.router.navigate(['login']);
    }
  }

  private getStatements() {
    this.imsRequest = new Ims();
    const header = new Header('2', 'STMT', 'VIEW');
    const dataHeader = new DataHeader(this.getCustomerId());
    dataHeader.stmtcnt = '30';
    dataHeader.fromDate = '';
    dataHeader.toDate = '';
    const dataContent = new DataContent();
    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    this.imsRequest.ims = request;

    this.accountService.getStatements(this.imsRequest).subscribe((data: Ims) => {
      this.accounts = data.ims.content.data.accounts;
      this.allAccounts = Object.assign(this.allAccounts, this.accounts);
    });
    this.countries  = this.sedolpayStateManagerService.getCountries();
  }
}
