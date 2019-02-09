
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Header } from '../models/header.model';
import { Ims } from '../models/ims.model';
import { Content } from '../models/content.model';
import { DataContent } from '../models/data-content.model';
import { DataHeader } from '../models/data-header.model';
import { RequestResponse } from '../models/request-response.model';
import { AccountService } from '../manage-accounts/shared/services/account.service';
import { Account } from '../models/account/account.model';

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
