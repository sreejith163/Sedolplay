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

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
})

export class MyProfileComponent implements OnInit {
  selecteCountryThree;
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

  timezone = [
    { value: 'EST', label: 'EST +6' },
    { value: 'GMT', label: 'GMT +6' },
  ];

  validationForm: FormGroup;
  passwordValidationForm: FormGroup;
  isUpdated = false;
  isFailed = false;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(private formBuilder: FormBuilder, private profileService: ProfileService) { }

  ngOnInit() {
    this.createValidationForm();
    this.createPasswordValidationForm();
    this.loadProfile();
  }

  updateProfile() {
    const request = this.getImsRequestFormat('PROFILE', 'UPDATE', false);
    this.profileService.updateProfileDetails(request).subscribe((data: Ims) => {
      this.isUpdated = true;
    }, error => {
      this.isFailed = true;
    });
  }

  updatePassword() {
    const request = this.getImsRequestFormat('PROFILE', 'UPDATE', true);
    this.profileService.updateProfileDetails(request).subscribe((data: Ims) => {
      this.isUpdated = true;
      this.passwordValidationForm.reset();
    }, error => {
      this.isFailed = true;
    });
  }

  closeAlertWindow() {
    this.resetAlertControls();
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  getPasswordControlBorderColour(control: string): any {
    return this.passwordValidationForm.controls[control].touched &&
           this.passwordValidationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  private loadProfile() {
    const request = this.getImsRequestFormat('PROFILE', 'VIEW', false);
    this.profileService.getProfileDetails(request).subscribe((data: Ims) => {
      this.setValidationValue(data.ims);
    });
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
    // this.validationForm.controls['timezone'].setValue(response.header.usertimezone);
    // this.validationForm.controls['timezone'].updateValueAndValidity();
    this.validationForm.controls['email'].setValue(profile.email);
    this.validationForm.controls['email'].updateValueAndValidity();
  }

  private getImsRequestFormat(type: string, mode: string, isPassword) {
    const imsRequest = new Ims();
    const header = new Header('2', type, mode, 'b08f86af-35da-48f2-8fab-cef3904660bd');
    const dataHeader = new DataHeader('172');
    dataHeader.portalUserid = '';
    const dataContent = new DataContent();
    if (mode === 'UPDATE' && !isPassword) {
      dataContent.docs = [];
      dataContent.info = this.getProfileInfo();
    } else if (mode === 'UPDATE' && isPassword) {
      dataContent.credential = this.getCredential();
      dataContent.docs = [];
      dataContent.info = this.getProfileInfo();
    }

    const content = new Content(dataHeader, dataContent);
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
    profile.dob = this.validationForm.controls['dob'].value;
    profile.email = this.validationForm.controls['email'].value;

    return profile;
  }

  private getCredential(): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = '';
    credential.password = '';

    return credential;
  }

  private createPasswordValidationForm() {
    this.passwordValidationForm = this.formBuilder.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.required],
      newPassConfirm: ['', Validators.required],
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
      dob: [new Date(), Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }

  private resetAlertControls() {
    this.isUpdated = false;
    this.isFailed = false;
  }
}
