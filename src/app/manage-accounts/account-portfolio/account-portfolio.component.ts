import { Component, OnInit } from '@angular/core';
import { AccountService } from '../shared/services/account.service';
import { Ims } from '../../models/ims.model';
import { DataHeader } from '../../models/data-header.model';
import { DataContent } from '../../models/data-content.model';
import { Content } from '../../models/content.model';
import { RequestResponse } from '../../models/request-response.model';
import { Header } from '../../models/header.model';
import { Account } from '../../models/account/account.model';

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
    private accountService: AccountService) { }

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

  private loadCustomerAccounts() {
    const imsRequest = new Ims();
    const header = new Header('2', 'ACCOUNTS', 'VIEW', 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
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
