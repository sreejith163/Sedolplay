import { Component, OnInit } from '@angular/core';
import { PaymentRequestService } from '../shared/services/payment-request.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { KeyValue } from '../../shared/models/key-value.model';
import { Beneficiary } from '../../shared/models/beneficiary.model';
import { Ims } from '../../shared/models/ims.model';
import { Transfer } from '../../reports/shared/models/transfer.model';
import { TransferCustomer } from '../../reports/shared/models/transfer-customer.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { Content } from '../../shared/models/content.model';
import { Account } from '../../manage-accounts/shared/models/account.model';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { SedolpayStateManagerService } from '../../shared/services/sedolpay-state-manager.service';

@Component({
  selector: 'app-external-transfer',
  templateUrl: './external-transfer.component.html',
  styleUrls: ['./external-transfer.component.scss']
})
export class ExternalTransferComponent implements OnInit {

  paymenttype = ['Payments', 'FX', 'Transfer'];
  type = ['IBAN',  'V_IBAN' ];
  countries: KeyValue[];
  accounts: Array<Account> = [];
  benefAccounts: Array<Beneficiary> = [];
  transRef: string;
  imsRequest: Ims;
  validationForm: FormGroup;
  loading = false;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(
    private paymentRequestService: PaymentRequestService,
    private authenticationService: AuthenticationService,
    private sedolpayStateManagerService: SedolpayStateManagerService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrManager) { }

  ngOnInit() {
    this.createValidationForm();
    this.loadDetails();
  }

  getFromAccountLabel(account: Account) {
    return account.cur + ' - ' + account.accNo;
  }

  getAvailableBal() {
    const fromAc = this.validationForm.controls['fromAc'].value;
    const selectedAccount = this.accounts.find(x => x.accNo === fromAc);
    if (selectedAccount !== undefined) {
      return selectedAccount.availbalance + ' ' + selectedAccount.cur;
    }
    return '';
  }

  fromAccountSelected() {
    const fromAc = this.validationForm.controls['fromAc'].value;
    const selectedAccount = this.accounts.find(x => x.accNo === fromAc);
    if (selectedAccount !== undefined) {
      this.updateFormValidator(+selectedAccount.availbalance);
      this.updateFormValidatorValues('viban', selectedAccount.viban);
    }
  }

  vibanSelected() {
    const viban = this.validationForm.controls['viban'].value;
    const selectedAccount = this.accounts.find(x => x.viban === viban);
    if (selectedAccount !== undefined) {
      this.updateFormValidator(+selectedAccount.availbalance);
      this.updateFormValidatorValues('fromAc', selectedAccount.accNo);
    }
  }

  benefSelected() {
    const toAc = this.validationForm.controls['toAc'].value;
    const selectedAccount = this.benefAccounts.find(x => x.accNo === toAc);
    if (selectedAccount !== undefined) {
      this.updateFormValidatorValues('acNo', selectedAccount.accNo);
      this.updateFormValidatorValues('addr', selectedAccount.address);
      this.updateFormValidatorValues('country', selectedAccount.country);
      this.updateFormValidatorValues('bankSwift', selectedAccount.bankSWIFTBIC);
      this.updateFormValidatorValues('bankCode', selectedAccount.bankRoutingCode);
      this.updateFormValidatorValues('bankName', selectedAccount.bankName);
    }
  }

  isAccountSelected() {
    const fromAc = this.validationForm.controls['fromAc'].value;
    if (fromAc !== undefined && fromAc !== '') {
      return true;
    }
     return false;
  }

  transferPayment() {
    this.loading = true;
    const fromAc = this.validationForm.controls['fromAc'].value;
    const payAmt = this.validationForm.controls['payAmt'].value;
    const remarks = this.validationForm.controls['remarks'].value;

    this.imsRequest.ims.header.mode = 'EXT';
    this.imsRequest.ims.content.dataheader.payBatchId = '';
    const transfer = new Transfer();
    transfer.chargeBearer = 'BEN';
    transfer.transType = 'EXT';
    transfer.transRef = 'WR' + this.getReferenceNo();
    transfer.payCur = this.accounts.find(x => x.accNo === fromAc).cur;
    transfer.type = 'PAYMENTS';
    transfer.orderCustomer = this.getOrderCustomer();
    transfer.benef = this.getBenefDetails();
    transfer.payAmt = payAmt;
    transfer.remarks = remarks;
    transfer.payDate = this.getPaymentDate();

    this.imsRequest.ims.content.data.transfer = [];
    this.imsRequest.ims.content.data.transfer.push(transfer);

    this.paymentRequestService.transferPayment(this.imsRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined && data.ims.content.dataheader.status === 'IN QUEUE. Reference: ' + transfer.transRef) {
        this.transRef = transfer.transRef;
       this.toastr.successToastr('Your payment request is posted and the last known status is IN QUEUE. Reference: ' + transfer.transRef,
                                  'Payment Transfer Success.', { toastTimeout: 10000, showCloseButton: true, dismiss: 'click' });
        this.resetValues();
      }
    }, error => {
      this.toastr.successToastr('Something went wrong.', 'Payment Transfer Failed!',
                                { toastTimeout: 10000, showCloseButton: true, dismiss: 'click' });
    }, () => this.loading = false);
  }

  getErrorMessageForBalance() {
    const currentValue = +this.validationForm.controls['payAmt'].value;
    const fromAc = this.validationForm.controls['fromAc'].value;
    const selectedAccount = this.accounts.find(x => x.accNo === fromAc);

    if (currentValue < 1) {
      return 'The minimum amount of transfer is 1 ' + selectedAccount.cur;
    } else {
      if (currentValue > +selectedAccount.availbalance) {
        return 'You need to enter an amount that is less than ' + selectedAccount.availbalance + ' ' + selectedAccount.cur;
      }
    }
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  isBeneficiaryInValid() {
    return this.validationForm.invalid || this.loading ||
           (this.validationForm.controls['bankCode'].value.trim() === '' &&
            this.validationForm.controls['bankSwift'].value.trim() === '');
  }

  private getReferenceNo(): any {
    return 100000 + Math.floor(Math.random() * 900000);
  }

  private getOrderCustomer(): TransferCustomer {
    const orderCust = new TransferCustomer();
    const fromAc = this.validationForm.controls['fromAc'].value;
    const selecetdAccount = this.accounts.find(x => x.accNo === fromAc);
    orderCust.accNo = selecetdAccount.accNo;
    orderCust.cur = selecetdAccount.cur;
    orderCust.viban = selecetdAccount.viban;
    orderCust.name = this.sedolpayStateManagerService.getUserName();

    return orderCust;
  }

  private getBenefDetails(): Beneficiary {
    const toAc = this.validationForm.controls['toAc'].value;
    return this.benefAccounts.find(x => x.accNo === toAc);
  }

  private getPaymentDate(): any {
    let date = '';
    const payDate = this.validationForm.controls['payDate'].value;

    if (payDate !== null) {
      const startDate = new Date(payDate.toString());
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
      const startDay = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate();
      date = startMonth.toString() + startDay.toString() + startYear.toString();
    }

    return date;
  }

  private loadDetails() {
    this.imsRequest = this.getImsRequestFormat();
    this.paymentRequestService.getPaymentViews(this.imsRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined) {
        this.accounts = data.ims.content.data.accounts;
        this.benefAccounts = data.ims.content.data.benef;
      }
    });
    this.countries = this.sedolpayStateManagerService.getCountries();
    if (!this.countries.length) {
      this.sedolpayStateManagerService.countriesLoaded.subscribe((data: Array<KeyValue>) => {
        if (data !== undefined) {
          this.countries = data;
        }
      });
    }
  }

  private getCustomerId(): any {
    const custId = this.authenticationService.getCustomerId();
    if (custId !== null && custId !== undefined && custId !== '') {
      return custId;
    } else {
      this.router.navigate(['loginn']);
    }
  }

  private getGenericImsRequestFormat( mode: string) {
    const imsRequest = new Ims();
    imsRequest.ims = new RequestResponse();
    imsRequest.ims.header = new Header('2', 'USER', mode);

    return imsRequest;
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('2', 'PAY', 'EXT-VIEW');
    const dataHeader = new DataHeader(this.getCustomerId());
    const dataContent = new DataContent();
    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      payType: ['', Validators.required],
      fromAc: ['', Validators.required],
      toAc: ['', Validators.required],
      viban: ['', Validators.required],
      type: ['', Validators.required],
      acNo: ['', Validators.required],
      addr: ['', Validators.required],
      bankSwift: [''],
      bankCode: [''],
      bankName: ['', Validators.required],
      country: ['', Validators.required],
      payAmt: ['', Validators.required],
      payDate: [new Date(), Validators.required],
      remarks: ['', Validators.required]
    });
  }

  private updateFormValidator(maxValue: any) {
    this.validationForm.controls['payAmt'].setValidators([Validators.compose([Validators.required,
    Validators.min(1), Validators.max(maxValue)])]);
    this.validationForm.controls['payAmt'].updateValueAndValidity();
  }

  private updateFormValidatorValues(controlName: string, controlValue: string) {
    this.validationForm.controls[controlName].setValue(controlValue);
    this.validationForm.controls[controlName].updateValueAndValidity();
  }

  private resetValues() {
    this.validationForm.reset();
  }
}
