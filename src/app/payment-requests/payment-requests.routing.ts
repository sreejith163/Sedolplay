import { Routes } from '@angular/router';
import { OwnAccountTransferComponent } from './own-account-transfer/own-account-transfer.component';
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component';
import { ExternalTransferComponent } from './external-transfer/external-transfer.component';
import { PayFromCardComponent } from './pay-from-card/pay-from-card.component';

export const PaymentRequestsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'own-account-transfer',
      component: OwnAccountTransferComponent,
      data: {
        title: 'own account transfer'
      }
    },
    {
      path: 'internal-transfer',
      component: InternalTransferComponent,
      data: {
        title: 'internal transfer'
      }
    },
    {
      path: 'external-transfer',
      component: ExternalTransferComponent,
      data: {
        title: 'extermal transfer'
      }
    },
    {
      path: 'pay-from-card',
      component: PayFromCardComponent,
      data: {
        title: 'pay from card'
      }
    }]
  }
];