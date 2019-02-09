import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from '../shared/services/beneficiary.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericService } from '../shared/services/generic.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { KeyValue } from '../shared/models/key-value.model';
import { Beneficiary } from '../shared/models/beneficiary.model';
import { Ims } from '../shared/models/ims.model';
import { Header } from '../shared/models/header.model';
import { DataHeader } from '../shared/models/data-header.model';
import { DataContent } from '../shared/models/data-content.model';
import { Content } from '../shared/models/content.model';
import { RequestResponse } from '../shared/models/request-response.model';

@Component({
  selector: 'app-manage-beneficiaries',
  templateUrl: './manage-beneficiaries.component.html',
  styleUrls: ['./manage-beneficiaries.component.scss']
})
export class ManageBeneficiariesComponent implements OnInit {
  type = ['INTERNAL', 'EXTERNAL'];
  selecteCountry = '';
  selectedType = '';
  selectedName = '';
  selectedBank = '';
  selectedAcNo = '';
  countries: KeyValue[];

  currency: KeyValue[];
  isHidden = true;
  isLoading = false;
  mode = '';
  benefId = '';
  benef: Beneficiary;
  availableBeneficiaries: Array<Beneficiary> = [];
  availableBeneficiariesOrig: Array<Beneficiary> = [];
  validationForm: FormGroup;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(
    private beneficiaryService: BeneficiaryService,
    private formBuilder: FormBuilder,
    private genericService: GenericService,
    private toastr: ToastrManager,
    config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.createValidationForm();
    this.loadBeneficiaryDetails();
  }

  openModal(deleteBenef, benefId: string) {
    this.benefId = benefId;
    this.modalService.open(deleteBenef);
  }

  dismissModal(option) {
    this.modalService.dismissAll(option);
  }

  onAddSelect() {
    this.isHidden = !this.isHidden;
    this.mode = 'Add';
  }

  onUpdateSelect(benef: Beneficiary) {
    this.isHidden = !this.isHidden;
    this.mode = 'Update';
    this.benefId = benef.benefId;
    this.setValidationValue(benef);
    this.scrollToBenefOperation();
  }

  onCancel() {
    this.isHidden = !this.isHidden;
    this.mode = '';
    this.resetValidationForm();
  }

  addbeneficiary() {
    this.isLoading = true;
    const immRequest = this.getImsRequestFormat('BENEF', 'UPDATE');
    this.beneficiaryService.addBeneficiaryDetails(immRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined && data.ims.content.dataheader.status === 'SUCCESS') {
        this.availableBeneficiaries.push(this.benef);
        this.resetValidationForm();
        this.isHidden = !this.isHidden;
        this.toastr.successToastr('Your request was processed successfully.', 'Beneficairy create success!');
        this.mode = '';
        this.validationForm.reset();
      } else {
        this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Beneficairy update failed!');
      }
    }, error => {
      this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Beneficairy update failed!!');
    }, () => {
      this.isLoading = false;
    });
  }

  updatebeneficiary() {
    this.isLoading = true;
    const immRequest = this.getImsRequestFormat('BENEF', 'UPDATE');
    this.beneficiaryService.updateBeneficiaryDetails(immRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined && data.ims.content.dataheader.status === 'SUCCESS') {
        this.isHidden = !this.isHidden;
        const index = this.availableBeneficiaries.findIndex(x => x.benefId === this.benefId);
        if (index !== -1) {
          this.availableBeneficiaries[index] = this.benef;
        }
        this.toastr.successToastr('Your request was processed successfully.', 'Beneficairy update success!');
        this.resetValidationForm();
        this.mode = '';
        this.validationForm.reset();
      } else {
        this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Beneficairy update failed!');
      }
    }, error => {
      this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Beneficairy update failed!');
    }, () => this.isLoading = false);
  }

  deleteBeneficiary() {
    this.isLoading = true;
    const immRequest = this.getImsRequestFormat('BENEF', 'DELETE', this.benefId);
    this.beneficiaryService.deleteBeneficiaryDetails(immRequest).subscribe((data: Ims) => {
      if (data.ims !== undefined && data.ims.content.dataheader.status === 'Successfully Deleted') {
        const index = this.availableBeneficiaries.findIndex(x => x.benefId === this.benefId);
        if (index !== -1) {
          this.availableBeneficiaries.splice(index, 1);
        }
        this.benefId = '';
        this.toastr.successToastr('Beneficiary was successfully deleted', 'Beneficiary delete success');
      }
    }, () => { }, () => this.isLoading = false);
    this.modalService.dismissAll();
  }

  filter() {
    this.availableBeneficiaries = this.availableBeneficiariesOrig;
    if (this.selectedAcNo !== '') {
      this.availableBeneficiaries = this.availableBeneficiaries.filter(i =>
        i.accNo.toLowerCase().indexOf(this.selectedAcNo.toLowerCase()) > -1);
    }
    if (this.selectedBank !== '') {
      this.availableBeneficiaries = this.availableBeneficiaries.filter(i =>
        i.bankName.toLowerCase().indexOf(this.selectedBank.toLowerCase()) > -1);
    }
    if (this.selectedName !== '') {
      this.availableBeneficiaries = this.availableBeneficiaries.filter(i =>
        i.name.toLowerCase().indexOf(this.selectedName.toLowerCase()) > -1);
    }
    if (this.selectedType !== '' && this.selectedType !== 'Any') {
      this.availableBeneficiaries = this.availableBeneficiaries.filter(i =>
        i.accType.toLowerCase().indexOf(this.selectedType.toLowerCase()) > -1);
    }
    if (this.selecteCountry !== '' && this.selecteCountry !== 'Any') {
      this.availableBeneficiaries = this.availableBeneficiaries.filter(i =>
        i.country.toLowerCase().indexOf(this.selecteCountry.toLowerCase()) > -1);
    }
  }

  getBenefName() {
    if (this.benefId !== undefined && this.benefId !== '') {
      return this.availableBeneficiaries.find(x => x.benefId === this.benefId).name;
    }

    return '';
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  private loadBeneficiaryDetails() {
    const imsRequest = this.getImsRequestFormat('ACCOUNTS', 'VIEW');
    this.beneficiaryService.getBeneficiaryDetails(imsRequest).subscribe((data: Ims) => {
      this.availableBeneficiaries = data.ims.content.data.benef;
      this.availableBeneficiariesOrig = Object.assign(this.availableBeneficiaries, this.availableBeneficiaries);
    });
    this.loadCountries();
    this.loadCurrencies();
  }

  private loadCountries() {
    const immRequest = this.getGenericImsRequestFormat('COUNTRY');
    this.genericService.getCountries(immRequest).subscribe((data: Ims) => {
      if (data !== undefined) {
        this.countries = data.ims.data.countries;
      }
    });
  }

  private loadCurrencies() {
    const immRequest = this.getGenericImsRequestFormat('CURRENCY');
    this.genericService.getCurrencies(immRequest).subscribe((data: Ims) => {
      if (data !== undefined) {
        this.currency = data.ims.data.currencies;
      }
    });
  }

  private getImsRequestFormat(type: string, mode: string, benefId?: string) {
    const imsRequest = new Ims();
    const header = new Header('2', type, mode, 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
    const dataContent = new DataContent();
    if (mode === 'VIEW') {
      dataContent.key = 'value';
    } else if (mode === 'DELETE') {
      dataContent.benef = [];
      const benef = new Beneficiary();
      benef.benefId = benefId;
      dataContent.benef.push(benef);
    } else if (mode === 'UPDATE') {
      dataContent.benef = [];
      dataContent.benef.push(this.loadValidationValue());
    }

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getGenericImsRequestFormat( mode: string) {
    const imsRequest = new Ims();
    imsRequest.ims = new RequestResponse();
    imsRequest.ims.header = new Header('2', 'USER', mode, '');

    return imsRequest;
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      name: ['', Validators.required],
      acNo: ['', Validators.required],
      addr: ['', Validators.required],
      bankSwift: ['', Validators.required],
      bankCode: ['', Validators.required],
      bankName: ['', Validators.required],
      bankType: ['', Validators.required],
      country: ['', Validators.required],
      curr: ['', Validators.required]
    });
  }

  private setValidationValue(benef: Beneficiary) {
    this.validationForm.controls['name'].setValue(benef.name);
    this.validationForm.controls['name'].updateValueAndValidity();
    this.validationForm.controls['acNo'].setValue(benef.accNo);
    this.validationForm.controls['acNo'].updateValueAndValidity();
    this.validationForm.controls['addr'].setValue(benef.address);
    this.validationForm.controls['addr'].updateValueAndValidity();
    this.validationForm.controls['bankSwift'].setValue(benef.bankSWIFTBIC);
    this.validationForm.controls['bankSwift'].updateValueAndValidity();
    this.validationForm.controls['bankCode'].setValue(benef.bankRoutingCode);
    this.validationForm.controls['bankCode'].updateValueAndValidity();
    this.validationForm.controls['bankName'].setValue(benef.bankName);
    this.validationForm.controls['bankName'].updateValueAndValidity();
    this.validationForm.controls['bankType'].setValue(benef.accType);
    this.validationForm.controls['bankType'].updateValueAndValidity();
    this.validationForm.controls['country'].setValue(benef.country);
    this.validationForm.controls['country'].updateValueAndValidity();
    this.validationForm.controls['curr'].setValue(benef.cur);
    this.validationForm.controls['curr'].updateValueAndValidity();
  }

  private loadValidationValue(): Beneficiary {
    this.benef = new Beneficiary();
    this.benef.benefId = this.benefId;
    this.benef.name = this.validationForm.controls['name'].value;
    this.benef.accNo = this.validationForm.controls['acNo'].value;
    this.benef.address = this.validationForm.controls['addr'].value;
    this.benef.bankSWIFTBIC = this.validationForm.controls['bankSwift'].value;
    this.benef.bankRoutingCode = this.validationForm.controls['bankCode'].value;
    this.benef.bankName = this.validationForm.controls['bankName'].value;
    this.benef.accType = this.validationForm.controls['bankType'].value;
    this.benef.country = this.validationForm.controls['country'].value;
    this.benef.cur = this.validationForm.controls['curr'].value;

    return this.benef;
  }

  private resetValidationForm() {
    this.validationForm.reset();
  }

  private scrollToBenefOperation() {
    const element = document.getElementById('benefElement');
    if (element !== undefined && element !== null) {
      window.scrollTo(0, element.offsetTop);
    }
  }
}
