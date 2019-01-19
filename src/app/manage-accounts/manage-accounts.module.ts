import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Pages Components by ace
import { pgSelectModule } from '../@pages/components/select/select.module';

import { pgTimePickerModule } from '../@pages/components/time-picker/timepicker.module';

import { pgSelectfx } from '../@pages/components/cs-select/select.module';
import { pgDatePickerModule } from '../@pages/components/datepicker/datepicker.module';


import { AccountPortfolioComponent } from './account-portfolio/account-portfolio.component';
import { StatementsComponent } from './statements/statements.component';
import { ApplyAdditionalAccountsComponent } from './apply-additional-accounts/apply-additional-accounts.component';

import { ManageAccountsRoutes } from './manage-accounts.routing';
import { AccountService } from './shared/services/account.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ManageAccountsRoutes),
    FormsModule,
    ReactiveFormsModule,
    pgSelectModule,
    pgTimePickerModule,
    pgSelectfx,
    pgDatePickerModule,

  ],
  declarations: [AccountPortfolioComponent, StatementsComponent, ApplyAdditionalAccountsComponent],
  providers: [AccountService]
})
export class ManageAccountsModule { }
