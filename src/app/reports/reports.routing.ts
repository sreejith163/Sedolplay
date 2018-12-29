import { Routes } from '@angular/router';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';


export const ReportsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'payment-status',
      component: PaymentStatusComponent,
      data: {
        title: 'payment status'
      }
    }, {
      path: 'transaction-history',
      component: TransactionHistoryComponent,
      data: {
        title: 'transaction history'
      }
    }]
  }
];