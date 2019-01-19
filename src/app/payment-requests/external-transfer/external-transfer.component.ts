import { Component, OnInit } from '@angular/core';
import { PaymentRequestService } from '../shared/services/payment-request.service';
import { Ims } from '../../models/ims.model';
import { Header } from '../../models/header.model';
import { DataHeader } from '../../models/data-header.model';
import { DataContent } from '../../models/data-content.model';
import { RequestResponse } from '../../models/request-response.model';
import { Content } from '../../models/content.model';
import { Account } from '../../models/account/account.model';
import { Transfer } from '../../models/transfer-track-payments/transfer.model';
import { TransferCustomer } from '../../models/transfer-track-payments/transfer-customer.model';
import { Beneficiary } from '../../models/beneficiary/beneficiary.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-external-transfer',
  templateUrl: './external-transfer.component.html',
  styleUrls: ['./external-transfer.component.scss']
})
export class ExternalTransferComponent implements OnInit {

  paymenttype = ['Payments', 'FX', 'Transfer'];
  type = ['IBAN',  'V_IBAN' ];
  countries: string[] = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'The Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi'
  ];
  accounts: Array<Account> = [];
  benefAccounts: Array<Beneficiary> = [];
  transRef: string;
  imsRequest: Ims;
  validationForm: FormGroup;
  isProcessed = false;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(private paymentRequestService: PaymentRequestService, private formBuilder: FormBuilder) { }

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
      if (data.ims.content.dataheader.status === 'IN QUEUE. Reference: ' + transfer.transRef) {
        this.transRef = transfer.transRef;
        this.resetValues();
        this.isProcessed = true;
      }
    });
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
    orderCust.name = 'Sreejith';

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
      this.accounts = data.ims.content.data.accounts;
      this.benefAccounts = data.ims.content.data.benef;
    });
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('', 'PAY', 'EXT-VIEW', 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
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
      bankSwift: ['', Validators.required],
      bankCode: ['', Validators.required],
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
