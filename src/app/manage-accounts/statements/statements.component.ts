import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AccountService } from '../shared/services/account.service';
import { Ims } from '../../models/ims.model';
import { RequestResponse } from '../../models/request-response.model';
import { Content } from '../../models/content.model';
import { DataContent } from '../../models/data-content.model';
import { DataHeader } from '../../models/data-header.model';
import { Header } from '../../models/header.model';
import { Statement } from '../../models/statement/statement.model';
import { StatementAccount } from '../../models/statement/statement-account.model';
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
  countries: string[] = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'The Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi'
  ];

  accounts: Array<any> = [];
  allAccounts: Array<any> = [];
  imsRequest: Ims;
  statements: Array<Statement> = [];
  selectedAccount: string;

  //Date Range Setup
  _startDate = null;
  _endDate = null;
  newArray = (len) => {
    const result = [];
    for (let i = 0; i < len; i++) {
      result.push(i);
    }
    return result;
  };
  _startValueChange = () => {
    if (this._startDate > this._endDate) {
      this._endDate = null;
    }
  };
  _endValueChange = () => {
    if (this._startDate > this._endDate) {
      this._startDate = null;
    }
  };
  _disabledStartDate = (startValue) => {
    if (!startValue || !this._endDate) {
      return false;
    }
    return startValue.getTime() >= this._endDate.getTime();
  };
  _disabledEndDate = (endValue) => {
    if (!endValue || !this._startDate) {
      return false;
    }
    return endValue.getTime() <= this._startDate.getTime();
  };
  get _isSameDay() {
    return this._startDate && this._endDate && moment(this._startDate).isSame(this._endDate, 'day')
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
    }
  }
  //END Date Range

  constructor(private accountService: AccountService) { }

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
      const endMonth = endDate.getMonth() + 1 < 10 ? '0' + (endDate.getMonth() + 1) : (endDate.getMonth() + 1) ;
      const endDay = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate();
      toDate = endMonth.toString() + endDay.toString() + endYear.toString();
    }

    this.imsRequest.ims.content.dataheader.fromDate = fromDate !== null ? fromDate : '';
    this.imsRequest.ims.content.dataheader.toDate = toDate !== null ? toDate : '';
    this.accountService.getStatements(this.imsRequest).subscribe((data: Ims) => {
      this.accounts = data.ims.content.data.accounts;
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

  private getStatements() {
    this.imsRequest = new Ims();
    const header = new Header('2', 'STMT', 'VIEW', 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
    dataHeader.stmtcnt = '30';
    dataHeader.fromDate = '';
    dataHeader.toDate = '';
    const dataContent = new DataContent();
    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    this.imsRequest.ims = request;

    this.accountService.getStatements(this.imsRequest).subscribe((data: Ims) => {
      this.accounts =  data.ims.content.data.accounts;
      this.allAccounts = Object.assign(this.allAccounts, this.accounts);
    });
  }

}
