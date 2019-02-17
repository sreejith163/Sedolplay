
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../manage-accounts/shared/services/account.service';
import { Account } from '../manage-accounts/shared/models/account.model';
import { DataHeader } from '../shared/models/data-header.model';
import { Ims } from '../shared/models/ims.model';
import { Header } from '../shared/models/header.model';
import { DataContent } from '../shared/models/data-content.model';
import { Content } from '../shared/models/content.model';
import { RequestResponse } from '../shared/models/request-response.model';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class CorporateDashboardComponent implements OnInit {

  accounts: Array<any> = [];
  selectedAccounts: Array<string> = [];
  totalBalance: number;
  Currency: string;

  constructor(
    private accountService: AccountService,
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() {
    this.loadCustomerAccounts();
  }

  routeToSelectedSection(routeName: string) {
    this.router.navigate([routeName]);
  }

  getAccountLabel(account: Account) {
    return account.cur + ' - ' + account.accNo;
  }

  setAccount() {
    if (this.selectedAccounts.length) {
      this.Currency = this.accounts.find(x => x.accNo === this.selectedAccounts).cur;
      this.totalBalance = this.accounts.find(x => x.accNo === this.selectedAccounts).availbalance;
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
        this.accounts = data.ims.content.data.accounts;
      }
    });
  }

  private getCustomerId(): any {
    const custId = this.authenticationService.getCustomerId();
    if (custId !== null && custId !== undefined && custId !== '') {
      return custId;
    } else {
      this.router.navigate(['login']);
    }
  }
}
