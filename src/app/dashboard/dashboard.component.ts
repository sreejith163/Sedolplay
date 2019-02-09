
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class CorporateDashboardComponent implements OnInit {

  accounts: Array<any> = [];
  accountno = [
    { value: 'USD-987977890', label: 'USD-987977890' },
    { value: 'EUR-987977890', label: 'EUR-987977890' }
  ];

  constructor(
    private accountService: AccountService,
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
        this.accounts = data.ims.content.data.accounts;
      }
    });
  }
}
