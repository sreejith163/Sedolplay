import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ims } from '../../models/ims.model';
import { Header } from '../../models/header.model';
import { DataHeader } from '../../models/data-header.model';
import { DataContent } from '../../models/data-content.model';
import { Content } from '../../models/content.model';
import { RequestResponse } from '../../models/request-response.model';
import { ProfileInfo } from '../../models/profile/profile-info.model';
import { ProfileCredential } from '../../models/profile/profile-credential.model';
import { ProfileCurr } from '../../models/profile/profile-curr.model';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';
import { matchOtherValidator } from '../shared/validators/match-other-validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterPageComponent implements OnInit {

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
  isFailed: boolean;
  isCreated: boolean;
  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.createValidationForm();
  }

  register() {
    this.resetValues();
    const request = this.getImsRequestFormat();
    this.userService.login(request).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'SUCCESS') {
        this.isCreated = true;
      } else {
        this.isFailed = true;
      }}, error => {
        this.isFailed = true;
      });
  }

  login() {
    this.router.navigate(['login']);
  }

  getRegisteredEmail() {
    return this.validationForm.controls['email'].value;
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'SIGNUP', '');
    const dataHeader = new DataHeader('');
    const dataContent = new DataContent();
    dataContent.acc = new ProfileCurr('USD');
    dataContent.credential = this.getCredential();
    dataContent.docs = [];
    dataContent.info = this.getProfileInfo();

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
    profile.active = 'N';

    return profile;
  }

  private getCredential(): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = '';
    credential.password = this.validationForm.controls['pass'].value;

    return credential;
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
      dob: [undefined, Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      pass: ['', Validators.required],
      passConfirm: ['', Validators.compose([Validators.required, matchOtherValidator('pass')])],
    });
  }

  private resetValues() {
    this.isCreated = false;
    this.isFailed = false;
  }
}
