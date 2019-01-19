import { Routes } from '@angular/router';
import {  CorporateLayoutComponent, BlankCorporateComponent } from './@pages/layouts';
import { CorporateDashboardComponent } from './dashboard/dashboard.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ManageBeneficiariesComponent } from './manage-beneficiaries/manage-beneficiaries.component';
import { TrackPaymentsComponent } from './track-payments/track-payments.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const AppRoutes: Routes = [

  {
    path: '',
    data: {
      breadcrumb: 'Home'
    },
    component: BlankCorporateComponent,
    loadChildren: './session/session.module#SessionModule',
  },
  {
    path: 'corporate',
    data: {
      breadcrumb: 'Home'
    },
    component: BlankCorporateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    children: [{
      path: 'dashboard',
      component: CorporateDashboardComponent,
      canActivate: [AuthGuard]
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'my-profile',
      component: MyProfileComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'manage-accounts',
      loadChildren: './manage-accounts/manage-accounts.module#ManageAccountsModule'
    }]
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'manage-beneficiaries',
      component: ManageBeneficiariesComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'payment-requests',
      loadChildren: './payment-requests/payment-requests.module#PaymentRequestsModule'
    }]
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'track-payments',
      component: TrackPaymentsComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'reports',
      loadChildren: './reports/reports.module#ReportsModule'
    }]
  },
  {
    path: 'corporate',
    component: CorporateLayoutComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'contact-us',
      component: ContactUsComponent,
    }],
  },
  {
    path: 'corporate',
    component: BlankCorporateComponent,
    canActivate: [AuthGuard],
    children: [{
      path: 'session',
      loadChildren: './session/session.module#SessionModule'
    }]
  }
];
