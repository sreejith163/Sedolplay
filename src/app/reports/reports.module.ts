import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Pages Components by ace
import { pgSelectModule } from '../@pages/components/select/select.module';

import { pgTimePickerModule } from '../@pages/components/time-picker/timepicker.module';

import { pgSelectfx } from '../@pages/components/cs-select/select.module';
import { pgDatePickerModule } from '../@pages/components/datepicker/datepicker.module';



import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { TransactionHistoryComponent } from './transaction-history/transaction-history.component';

import { ReportsRoutes } from './reports.routing';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ReportsRoutes),
    FormsModule,
    ReactiveFormsModule,
    pgSelectModule,
    pgTimePickerModule,
    pgSelectfx,
    pgDatePickerModule
  ],
  declarations: [PaymentStatusComponent, TransactionHistoryComponent]
})
export class ReportsModule { }
