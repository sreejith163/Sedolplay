import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { pagesToggleService } from '../../services/toggler.service';
import { GenericService } from '../../../shared/services/generic.service';
import { SedolpayStateManagerService } from '../../../shared/services/sedolpay-state-manager.service';
import { Ims } from '../../../shared/models/ims.model';
import { RequestResponse } from '../../../shared/models/request-response.model';
import { Header } from '../../../shared/models/header.model';
import { ProfileService } from '../../../shared/services/profile.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { DataHeader } from '../../../shared/models/data-header.model';
import { DataContent } from '../../../shared/models/data-content.model';
import { Content } from '../../../shared/models/content.model';

@Component({
  selector: 'app-corporate-layout',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CorporateLayoutComponent extends RootLayout implements OnInit {
  menuLinks = [
    {
      label: 'Home',
      routerLink: 'dashboard',
      iconType: 'fa',
      iconName: 'home',
      thumbNailClass: 'text-white'
    },
    {
      label: 'My Profile',
      routerLink: 'my-profile',
      iconType: 'fa',
      iconName: 'user',
      thumbNailClass: 'text-white'
    },
    {
      label: 'Manage Accounts',
      iconType: 'fa',
      iconName: 'database',
      toggle: 'close',
      submenu: [
        {
          label: 'Account Portfolio',
          routerLink: 'manage-accounts/account-portfolio',
          enabled: 'true'

        },
        {
          label: 'Statements',
          routerLink: 'manage-accounts/statements',
          enabled: 'true'

        },
        {
          label: 'Apply Additional Accounts',
          routerLink: 'manage-accounts/',
          enabled: 'false'
        }
      ]
    },
    {
      label: 'Manage Beneficiaries',
      routerLink: 'manage-beneficiaries',
      iconType: 'fa',
      iconName: 'users',
      thumbNailClass: 'text-white'
    },
    {
      label: 'Payment Requests',
      iconType: 'fa',
      iconName: 'hand-holding-usd',
      toggle: 'close',
      submenu: [
        {
          label: 'Own Account Transfer',
          routerLink: 'payment-requests/own-account-transfer',
          enabled: 'true'
        },
        {
          label: 'Internal Transfer',
          routerLink: 'payment-requests/internal-transfer',
          enabled: 'true'
        },
        {
          label: 'External Transfer',
          routerLink: 'payment-requests/external-transfer',
          enabled: 'true'
        },
        {
          label: 'Pay From Card',
          routerLink: 'payment-requests/pay-from-card',
          enabled: 'false'
        }
      ]
    },
    {
      label: 'Track Payments',
      routerLink: 'track-payments',
      iconType: 'fa',
      iconName: 'search-dollar',
      thumbNailClass: 'text-white'
    },
    {
      label: 'Reports',
      iconType: 'fa',
      iconName: 'file-chart-line',
      toggle: 'close',
      submenu: [
        {
          label: 'Payment Status',
          routerLink: 'reports/payment-status',
          enabled: 'true'
        },
        {
          label: 'Transaction History',
          routerLink: 'reports/transaction-history',
          enabled: 'true'
        },
      ]
    },
    {
      label: 'Contact Us',
      routerLink: 'contact-us',
      iconType: 'fa',
      iconName: 'envelope',
      thumbNailClass: 'text-white'
    },

  ];

  constructor(
    public toggler: pagesToggleService,
    public router: Router,
    private authService: AuthenticationService,
    private profileService: ProfileService,
    private sedolpayStateManagerService: SedolpayStateManagerService,
    private genericService: GenericService) {
    super(toggler, router);
  }

  ngOnInit() {
    this.changeLayout('menu-pin');
    this.changeLayout('menu-behind');
    this.autoHideMenuPin();
    this.loadDetails();
  }

  logout() {
    this.authService.logout();
    this.sedolpayStateManagerService.clearStateManagerData();
    this.router.navigate(['login']);
  }

  getUserName() {
    return this.sedolpayStateManagerService.getUserName();
  }

  private loadDetails() {
    this.loadUserDetails();
    this.loadCurrencies();
    this.loadCountries();
    this.loadTimezones();
  }

  private loadUserDetails() {
    const userName = this.sedolpayStateManagerService.getUserName();
    if (userName === null || userName === undefined || !userName.length) {
      const request = this.getImsRequestFormatForProfile('PROFILE', 'VIEW');
      this.profileService.getProfileDetails(request).subscribe((data: Ims) => {
        if (data.ims !== undefined && data.ims.content.data.info !== undefined) {
          const name = data.ims.content.data.info.firstName + ' ' + data.ims.content.data.info.lastName;
          this.sedolpayStateManagerService.setUserName(name);
        }
      });
    }
  }

  private loadCurrencies() {
    const currencies = this.sedolpayStateManagerService.getCurrencies();
    if (!currencies.length) {
      const immRequest = this.getImsRequestFormat('CURRENCY');
      this.genericService.getCurrencies(immRequest).subscribe((data: Ims) => {
        if (data !== undefined && data.ims.data.currencies !== undefined && data.ims.data.currencies.length) {
          this.sedolpayStateManagerService.setCurrencies(data.ims.data.currencies);
          this.sedolpayStateManagerService.currenciesChanged();
        }
      });
    }
  }

  private loadCountries() {
    const countries = this.sedolpayStateManagerService.getCountries();
    if (!countries.length) {
      const immRequest = this.getImsRequestFormat('COUNTRY');
      this.genericService.getCountries(immRequest).subscribe((data: Ims) => {
        if (data !== undefined && data.ims.data.countries !== undefined && data.ims.data.countries.length) {
          this.sedolpayStateManagerService.setCountries(data.ims.data.countries);
          this.sedolpayStateManagerService.countriesChanged();
        }
      });
    }
  }

  private loadTimezones() {
    const timeZones = this.sedolpayStateManagerService.getTimeZones();
    if (!timeZones.length) {
      const immRequest = this.getImsRequestFormat('TIMEZONE');
      this.genericService.getTimezone(immRequest).subscribe((data: Ims) => {
        if (data !== undefined && data.ims.data.timezones !== undefined && data.ims.data.timezones.length) {
          this.sedolpayStateManagerService.setTimeZones(data.ims.data.timezones);
          this.sedolpayStateManagerService.timeZonesChanged();
        }
      });
    }
  }

  private getCustomerId(): any {
    const custId = this.authService.getCustomerId();
    if (custId !== null && custId !== undefined && custId !== '') {
      return custId;
    } else {
      this.router.navigate(['login']);
    }
  }

  private getImsRequestFormat( mode: string) {
    const imsRequest = new Ims();
    imsRequest.ims = new RequestResponse();
    imsRequest.ims.header = new Header('2', 'USER', mode, this.sedolpayStateManagerService.getTimezone());

    return imsRequest;
  }

  private getImsRequestFormatForProfile(type: string, mode: string) {
    const imsRequest = new Ims();
    const header = new Header('2', type, mode, this.sedolpayStateManagerService.getTimezone());
    const dataHeader = new DataHeader(this.getCustomerId());
    dataHeader.portalUserid = '';
    const dataContent = new DataContent();
    dataContent.docs = [];

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }
}
