import { Component, OnInit } from '@angular/core';
import { BeneficiaryService } from '../shared/services/beneficiary.service';
import { Ims } from '../models/ims.model';
import { Header } from '../models/header.model';
import { DataHeader } from '../models/data-header.model';
import { DataContent } from '../models/data-content.model';
import { Content } from '../models/content.model';
import { RequestResponse } from '../models/request-response.model';
import { Beneficiary } from '../models/beneficiary/beneficiary.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  currency = ['USD', 'EUR', 'GBP'];
  isHidden = true;
  isSaved = false;
  isFailed = false;
  mode = '';
  benefId = '';
  availableBeneficiaries: Array<Beneficiary> = [];
  availableBeneficiariesOrig: Array<Beneficiary> = [];
  validationForm: FormGroup;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(private beneficiaryService: BeneficiaryService, private formBuilder: FormBuilder,
    config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.createValidationForm();
    this.loadBeneficiaryDetails();
  }

  open(deleteBenef, benefId: string) {
    this.benefId = benefId;
    this.modalService.open(deleteBenef);
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
    const immRequest = this.getImsRequestFormat('BENEF', 'UPDATE');
    this.beneficiaryService.deleteBeneficiaryDetails(immRequest).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'SUCCESS') {
        this.resetValidationForm();
        this.isHidden = !this.isHidden;
        this.isSaved = true;
        this.mode = '';
        this.validationForm.reset();
      } else {
        this.isFailed = true;
      }
    }, error => {
      this.isFailed = true;
    });
  }

  updatebeneficiary() {
    const immRequest = this.getImsRequestFormat('BENEF', 'UPDATE');
    this.beneficiaryService.deleteBeneficiaryDetails(immRequest).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'SUCCESS') {
        this.isHidden = !this.isHidden;
        this.isSaved = true;
        this.resetValidationForm();
        this.mode = '';
        this.validationForm.reset();
      } else {
        this.isFailed = true;
      }
    }, error => {
      this.isFailed = true;
    });
  }

  deleteBeneficiary(benefDeleted) {
    const immRequest = this.getImsRequestFormat('BENEF', 'DELETE', this.benefId);
    this.beneficiaryService.deleteBeneficiaryDetails(immRequest).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'Successfully Deleted') {
        const index = this.availableBeneficiaries.findIndex(x => x.benefId === this.benefId);
        if (index !== -1) {
          this.availableBeneficiaries.splice(index, 1);
        }
        this.benefId = '';
        this.modalService.dismissAll();
        this.modalService.open(benefDeleted);
      }
    });
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
    if (this.selectedType !== '') {
      this.availableBeneficiaries = this.availableBeneficiaries.filter(i =>
        i.accType.toLowerCase().indexOf(this.selectedType.toLowerCase()) > -1);
    }
    if (this.selecteCountry !== '') {
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

  closeAlertWindow() {
    this.resetAlertControls();
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
    const benef = new Beneficiary();
    benef.benefId = this.benefId;
    benef.name = this.validationForm.controls['name'].value;
    benef.accNo = this.validationForm.controls['acNo'].value;
    benef.address = this.validationForm.controls['addr'].value;
    benef.bankSWIFTBIC = this.validationForm.controls['bankSwift'].value;
    benef.bankRoutingCode = this.validationForm.controls['bankCode'].value;
    benef.bankName = this.validationForm.controls['bankName'].value;
    benef.accType = this.validationForm.controls['bankType'].value;
    benef.country = this.validationForm.controls['country'].value;
    benef.cur = this.validationForm.controls['curr'].value;

    return benef;
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

  private resetAlertControls() {
    this.isSaved = false;
    this.isFailed = false;
  }
}
