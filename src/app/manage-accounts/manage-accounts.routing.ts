import { Routes } from '@angular/router';
import { AccountPortfolioComponent } from './account-portfolio/account-portfolio.component';
import { StatementsComponent } from './statements/statements.component';
import { ApplyAdditionalAccountsComponent } from './apply-additional-accounts/apply-additional-accounts.component';

export const ManageAccountsRoutes: Routes = [
  {
    path: '',
    children: [{
      path: 'account-portfolio',
      component: AccountPortfolioComponent,
      data: {
        title: 'account portfolio'
      }
    }, {
      path: 'statements',
      component: StatementsComponent,
      data: {
        title: 'statements'
      }
    }, {
      path: 'apply-additional-accounts',
      component: ApplyAdditionalAccountsComponent,
      data: {
        title: 'apply additional accounts'
      }
    }]
  }
];