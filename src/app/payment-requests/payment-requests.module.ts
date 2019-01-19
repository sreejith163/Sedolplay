import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


//Pages Components by ace
import { pgSelectModule } from '../@pages/components/select/select.module';

import { pgTimePickerModule } from '../@pages/components/time-picker/timepicker.module';

import { pgSelectfx } from '../@pages/components/cs-select/select.module';
import { pgDatePickerModule } from '../@pages/components/datepicker/datepicker.module';
import { TypeaheadModule } from 'ngx-bootstrap';

import { OwnAccountTransferComponent } from './own-account-transfer/own-account-transfer.component';
import { InternalTransferComponent } from './internal-transfer/internal-transfer.component';
import { ExternalTransferComponent } from './external-transfer/external-transfer.component';
import { PayFromCardComponent } from './pay-from-card/pay-from-card.component';

import { PaymentRequestsRoutes } from './payment-requests.routing';
import { PaymentRequestService } from './shared/services/payment-request.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PaymentRequestsRoutes),
    FormsModule,
    ReactiveFormsModule,
    pgSelectModule,
    pgTimePickerModule,
    pgSelectfx,
    pgDatePickerModule,
    TypeaheadModule
  ],
  declarations: [OwnAccountTransferComponent, InternalTransferComponent, ExternalTransferComponent, PayFromCardComponent],
  providers: [PaymentRequestService]
})
export class PaymentRequestsModule { }
