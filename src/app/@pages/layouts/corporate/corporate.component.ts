import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RootLayout } from '../root/root.component';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { pagesToggleService } from '../../services/toggler.service';


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

        },
        {
          label: 'Statements',
          routerLink: 'manage-accounts/statements',

        },
        {
          label: 'Apply Additional Accounts',
          routerLink: 'manage-accounts/',

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

        },
        {
          label: 'Internal Transfer',
          routerLink: 'payment-requests/internal-transfer',

        },
        {
          label: 'External Transfer',
          routerLink: 'payment-requests/external-transfer',
        },
        {
          label: 'Pay From Card',
          routerLink: 'payment-requests/pay-from-card',
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
        },
        {
          label: 'Transaction History',
          routerLink: 'reports/transaction-history',
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
    private authService: AuthenticationService) {
    super(toggler, router);
  }

  ngOnInit() {
    this.changeLayout('menu-pin');
    this.changeLayout('menu-behind');
    this.autoHideMenuPin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
