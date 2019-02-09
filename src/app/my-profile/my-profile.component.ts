import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../shared/services/profile.service';
import { ProfileInfo } from '../models/profile/profile-info.model';
import { Ims } from '../models/ims.model';
import { Header } from '../models/header.model';
import { DataHeader } from '../models/data-header.model';
import { DataContent } from '../models/data-content.model';
import { Content } from '../models/content.model';
import { RequestResponse } from '../models/request-response.model';
import { ProfileCredential } from '../models/profile/profile-credential.model';
import { KeyValue } from '../models/key-value.model';
import { GenericService } from '../shared/services/generic.service';
import { TimeZone } from '../models/timezone.model';
import { matchOtherValidator } from '../session/shared/validators/match-other-validator';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})

export class MyProfileComponent implements OnInit {
  countries: KeyValue[];
  timezone: TimeZone[];
  loading = false;

  validationForm: FormGroup;
  passwordValidationForm: FormGroup;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastr: ToastrManager,
    private genericService: GenericService) { }

  ngOnInit() {
    this.createValidationForm();
    this.createPasswordValidationForm();
    this.loadProfile();
  }

  updateProfile() {
    this.loading = true;
    const request = this.getImsRequestFormatForProfile('PROFILE', 'UPDATE');
    this.profileService.updateProfileDetails(request).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'SUCCESS') {
        this.toastr.successToastr('Your profile was successfully updated.', 'Profile updation success!');
      } else {
        this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Profile updation failed!');
      }
    }, error => {
      this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Profile updation failed!');
    }, () => this.loading = false);
  }

  updatePassword() {
    this.loading = true;
    const request = this.getImsRequestFormatForPasswordUpdate();
    this.profileService.updatePassword(request).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'SUCCESS') {
        this.toastr.successToastr('Your profile was successfully updated.', 'Profile updation success!');
        this.passwordValidationForm.reset();
      } else {
        this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Profile updation failed!');
      }
    }, error => {
      this.toastr.errorToastr('Internal account updation failed due to missing account details.', 'Profile updation failed!');
    }, () => this.loading = false);
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  getPasswordControlBorderColour(control: string): any {
    return this.passwordValidationForm.controls[control].touched &&
           this.passwordValidationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  getTimezoneLabel(offset: string, id: string) {
    const index = id.lastIndexOf('/') + 1;
    if (index !== -1) {
      return offset + ' ' + id.substring(index);
    }

    return offset + id;
  }

  private loadProfile() {
    const request = this.getImsRequestFormatForProfile('PROFILE', 'VIEW');
    this.profileService.getProfileDetails(request).subscribe((data: Ims) => {
      this.setValidationValue(data.ims);
    });
    this.loadCountries();
    this.loadTimeZones();
  }

  private loadCountries() {
    const immRequest = this.getGenericImsRequestFormat('COUNTRY');
    this.genericService.getCountries(immRequest).subscribe((data: Ims) => {
      if (data !== undefined) {
        this.countries = data.ims.data.countries;
      }
    });
  }

  private loadTimeZones() {
    const immRequest = this.getGenericImsRequestFormat('TIMEZONE');
    this.genericService.getTimezone(immRequest).subscribe((data: Ims) => {
      if (data !== undefined) {
        this.timezone = data.ims.data.timezones;
      }
    });
  }

  private getGenericImsRequestFormat( mode: string) {
    const imsRequest = new Ims();
    imsRequest.ims = new RequestResponse();
    imsRequest.ims.header = new Header('2', 'USER', mode, '');

    return imsRequest;
  }

  private setValidationValue(response: RequestResponse) {
    const profile = response.content.data.info;
    this.validationForm.controls['firstName'].setValue(profile.firstName);
    this.validationForm.controls['firstName'].updateValueAndValidity();
    this.validationForm.controls['middleName'].setValue(profile.middleName);
    this.validationForm.controls['middleName'].updateValueAndValidity();
    this.validationForm.controls['lastName'].setValue(profile.lastName);
    this.validationForm.controls['lastName'].updateValueAndValidity();
    this.validationForm.controls['address1'].setValue(profile.address1);
    this.validationForm.controls['address1'].updateValueAndValidity();
    this.validationForm.controls['address2'].setValue(profile.address2);
    this.validationForm.controls['address2'].updateValueAndValidity();
    this.validationForm.controls['zip'].setValue(profile.zip);
    this.validationForm.controls['zip'].updateValueAndValidity();
    this.validationForm.controls['country'].setValue(profile.country);
    this.validationForm.controls['country'].updateValueAndValidity();
    this.validationForm.controls['mobile'].setValue(profile.mobile);
    this.validationForm.controls['mobile'].updateValueAndValidity();
    this.validationForm.controls['telephone'].setValue(profile.telephone);
    this.validationForm.controls['telephone'].updateValueAndValidity();
    this.validationForm.controls['dob'].setValue(profile.dob);
    this.validationForm.controls['dob'].updateValueAndValidity();
    this.validationForm.controls['timezone'].setValue(response.header.usertimezone);
    this.validationForm.controls['timezone'].updateValueAndValidity();
    this.validationForm.controls['email'].setValue(profile.email);
    this.validationForm.controls['email'].updateValueAndValidity();
  }

  private getImsRequestFormatForProfile(type: string, mode: string) {
    const imsRequest = new Ims();
    const header = new Header('2', type, mode, 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
    dataHeader.portalUserid = '';
    const dataContent = new DataContent();
    dataContent.docs = [];
    dataContent.info = this.getProfileInfo();

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getImsRequestFormatForPasswordUpdate() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'PASSWORDUPDATE', '');
    const dataContent = new DataContent();
    dataContent.credential = this.getCredential();
    dataContent.info = new ProfileInfo();
    dataContent.info.email = this.validationForm.controls['email'].value;

    const content = new Content();
    content.data = dataContent;
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getProfileInfo(): ProfileInfo {
    const profile = new ProfileInfo();
    profile.firstName = this.validationForm.controls['firstName'].value;
    profile.middleName = this.validationForm.controls['middleName'].value;
    profile.lastName = this.validationForm.controls['lastName'].value;
    profile.address1 = this.validationForm.controls['address1'].value;
    profile.address2 = this.validationForm.controls['address2'].value;
    profile.zip = this.validationForm.controls['zip'].value;
    profile.country = this.validationForm.controls['country'].value;
    profile.mobile = this.validationForm.controls['mobile'].value;
    profile.telephone = this.validationForm.controls['telephone'].value;
    profile.dob = this.getDobFormat(this.validationForm.controls['dob'].value);
    profile.email = this.validationForm.controls['email'].value;

    return profile;
  }

  private getCredential(): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = '';
    credential.password = this.passwordValidationForm.controls['newPass'].value;
    credential.password = CryptoJS.AES.encrypt('', credential.password);

    return credential;
  }

  private getDobFormat(value) {
    const startDate = new Date(value.toString());
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
    const startDay = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate();
    return startMonth.toString() + startDay.toString() + startYear.toString();
  }

  private createPasswordValidationForm() {
    this.passwordValidationForm = this.formBuilder.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.required],
      newPassConfirm: ['', Validators.compose([Validators.required, matchOtherValidator('newPass')])],
    });
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
      timezone: ['', Validators.required],
      mobile: ['', Validators.required],
      telephone: [''],
      dob: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }
}
