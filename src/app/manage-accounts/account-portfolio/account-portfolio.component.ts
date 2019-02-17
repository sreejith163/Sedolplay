import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { Account } from '../shared/models/account.model';
import { Ims } from '../../shared/models/ims.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { Content } from '../../shared/models/content.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-portfolio',
  templateUrl: './account-portfolio.component.html',
  styleUrls: ['./account-portfolio.component.scss']
})
export class AccountPortfolioComponent implements OnInit {

  type = ['All', 'Transaction'];
  viewcurrency = [];
  accounts: Array<any> = [];
  allAccounts: Array<any> = [];
  searchText: string;
  selectedCurrency: any;
  selectedType: any;
  selectedViewcurrency: any;

  constructor(
    private authenticationService: AuthenticationService,
    private accountService: AccountService,
    private router: Router) { }

  ngOnInit() {
    this.loadCustomerAccounts();
  }

  filter() {
    this.accounts = this.allAccounts;
    if (this.searchText !== undefined) {
      this.accounts = this.accounts.filter(i =>
        i.accNo.toLowerCase().indexOf(this.searchText.toLowerCase()) > -1);
    }
    if (this.selectedCurrency !== undefined && this.selectedCurrency !== 'All') {
      this.accounts = this.accounts.filter(i =>
        i.cur.toLowerCase().indexOf(this.selectedCurrency.toLowerCase()) > -1);
    }
    if (this.selectedType !== undefined && this.selectedType !== 'All') {
      this.accounts = this.accounts.filter(i =>
        i.type.toLowerCase().indexOf(this.selectedType.toLowerCase()) > -1);
    }
  }

  getFixRate(account: Account): string {
    const rate = account.otherCur[this.selectedViewcurrency].fxRate;
    return rate;
  }

  getFixAmount(account: Account): string {
    const amount = account.otherCur[this.selectedViewcurrency].amt;
    return amount;
  }

  private getCustomerId(): any {
    const custId = this.authenticationService.getCustomerId();
    if (custId !== null && custId !== undefined && custId !== '') {
      return custId;
    } else {
      this.router.navigate(['login']);
    }
  }

  private loadCustomerAccounts() {
    const imsRequest = new Ims();
    const header = new Header('2', 'ACCOUNTS', 'VIEW');
    const dataHeader = new DataHeader(this.getCustomerId());
    const dataContent = new DataContent();
    dataContent.key = 'value';
    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    this.accountService.getAccountPortfolio(imsRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined) {
        this.viewcurrency = data.ims.content.data.viewCur;
        this.selectedViewcurrency = this.viewcurrency[0];
        this.accounts = data.ims.content.data.accounts;
        this.allAccounts = Object.assign(this.allAccounts, this.accounts);
      }
    });
  }
}
