import { Routes } from '@angular/router';
//Layouts
import {
  CorporateLayout,
  BlankCorporateComponent
} from './@pages/layouts';

//Sample Pages

import { CorporateDashboardComponent } from './dashboard/dashboard.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ManageBeneficiariesComponent } from './manage-beneficiaries/manage-beneficiaries.component';
import { TrackPaymentsComponent } from './track-payments/track-payments.component';
export const AppRoutes: Routes = [

  {
    path: 'corporate',
    data: {
      breadcrumb: 'Home'
    },
    component: BlankCorporateComponent
  },

  // //Corporate Layout Styles and Routing
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'dashboard',
      component: CorporateDashboardComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'my-profile',
      component: MyProfileComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'manage-accounts',
      loadChildren: './manage-accounts/manage-accounts.module#ManageAccountsModule'
    }]
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'manage-beneficiaries',
      component: ManageBeneficiariesComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'payment-requests',
      loadChildren: './payment-requests/payment-requests.module#PaymentRequestsModule'
    }]
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'track-payments',
      component: TrackPaymentsComponent
    }],
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'reports',
      loadChildren: './reports/reports.module#ReportsModule'
    }]
  },
  {
    path: 'corporate',
    component: CorporateLayout,
    children: [{
      path: 'contact-us',
      component: ContactUsComponent
    }],
  },
  {
    path: 'corporate',
    component: BlankCorporateComponent,
    children: [{
      path: 'session',
      loadChildren: './session/session.module#SessionModule'
    }]
  }

];
