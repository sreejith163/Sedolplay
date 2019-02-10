import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { matchOtherValidator } from '../shared/validators/match-other-validator';
import { GenericService } from '../../shared/services/generic.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EmailRequest } from '../../shared/models/email-request.model';
import { EmailTemplateParams } from '../../shared/models/email-template-params.model';
import { EmailService } from '../../shared/services/email.service';
import { EncrDecrService } from '../../shared/services/encr-decr.service';
import { KeyValue } from '../../shared/models/key-value.model';
import { TimeZone } from '../../shared/models/timezone.model';
import { Ims } from '../../shared/models/ims.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { ProfileCurr } from '../../shared/models/profile-curr.model';
import { Content } from '../../shared/models/content.model';
import { ProfileInfo } from '../../shared/models/profile-info.model';
import { ProfileCredential } from '../../shared/models/profile-credential.model';
import { AppConfigService } from '../../shared/services/app-config.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterPageComponent implements OnInit {

  countries: KeyValue[];
  timezone: TimeZone[];
  currency: KeyValue[];
  validationForm: FormGroup;
  loading: boolean;
  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(
    private formBuilder: FormBuilder,
    private genericService: GenericService,
    private userService: UserService,
    private emailService: EmailService,
    private environmentService: AppConfigService,
    private encrDecrService: EncrDecrService,
    private toastr: ToastrManager,
    private router: Router) { }

  ngOnInit() {
    this.createValidationForm();
    this.loadCountries();
    this.loadTimeZones();
    this.loadCurrencies();
  }

  register() {
    this.loading = true;
    const request = this.getImsRequestFormat();
    this.userService.register(request).subscribe((data: Ims) => {
      if (data !== undefined && data.ims.content.dataheader.status === 'SUCCESS') {
        this.sentRegMail(data.ims.content.data.credential.userName, );
      } else {
        this.toastr.errorToastr('Failed to create new account', 'Registration failed!');
      }
    }, error => {
      this.toastr.errorToastr('Failed to create new account', 'Registration failed!');
    }, () => this.loading = false);
  }

  login() {
    this.router.navigate(['login']);
  }

  getRegisteredEmail() {
    return this.validationForm.controls['regEmail'].value;
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  getTimezoneLabel(offset: string, id: string) {
    const index = id.lastIndexOf('/') + 1;
    if (index !== -1) {
      return offset + ' ' + id.substring(index);
    }

    return offset + id;
  }

  private sentRegMail(userName: string) {
    const request = this.getEmailRequestForRegistration(userName);
    this.emailService.sendMail(request).subscribe(() => {
      this.toastr.successToastr('An email has been sent to ' + this.getRegisteredEmail() + ', please click the link ' +
                                  'in the email to activate your account. You can login after you have activated your account.',
                                  'Registration Success!');
      this.validationForm.reset();
    }, () => this.toastr.errorToastr('Sending email to registered mail has been failed.', 'Email sent failed!'));
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

  private loadCurrencies() {
    const immRequest = this.getGenericImsRequestFormat('CURRENCY');
    this.genericService.getCurrencies(immRequest).subscribe((data: Ims) => {
      if (data !== undefined) {
        this.currency = data.ims.data.currencies;
      }
    });
  }

  private getGenericImsRequestFormat( mode: string) {
    const imsRequest = new Ims();
    imsRequest.ims = new RequestResponse();
    imsRequest.ims.header = new Header('2', 'USER', mode, '');

    return imsRequest;
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'SIGNUP', '');
    const dataHeader = new DataHeader('');
    const dataContent = new DataContent();
    dataContent.acc = new ProfileCurr(this.validationForm.controls['curr'].value);
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
    profile.dob = this.getDobFormat(this.validationForm.controls['dob'].value);
    profile.email = this.validationForm.controls['regEmail'].value;
    profile.active = 'N';

    return profile;
  }

  private getCredential(): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = '';
    credential.password = this.encrDecrService.encryptPassword(this.validationForm.controls['pass'].value);

    return credential;
  }

  private getDobFormat(value) {
    const startDate = new Date(value.toString());
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1 < 10 ? '0' + (startDate.getMonth() + 1) : (startDate.getMonth() + 1);
    const startDay = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate();
    return startMonth.toString() + startDay.toString() + startYear.toString();
  }

  private getEmailRequestForRegistration(userName: string): EmailRequest {
    const emailRequest = new EmailRequest();
    emailRequest.service_id = this.environmentService.environment['email'].service_id;
    emailRequest.template_id = this.environmentService.environment['email'].template_id;
    emailRequest.user_id = this.environmentService.environment['email'].user_id;
    emailRequest.template_params = new EmailTemplateParams();
    emailRequest.template_params.subject = 'SedolPay Account Activation';
    emailRequest.template_params.content = this.getMailContent(userName);
    emailRequest.template_params.reply_email = this.validationForm.controls['regEmail'].value;
    return emailRequest;
  }

  private getMailContent(userName: string): string {
    let message = '';
    const name = this.validationForm.controls['firstName'].value;
    const email = this.getRegisteredEmail();
    const key = this.encrDecrService.encryptMailContent('hash=' + userName + '&email=' + email);

    message += '<b>Dear ' + name + '<br><br><br><br>';
    message += 'Please click this <a href=="http://localhost:4200/login?key="' + key + '>link</a>';
    message += 'to activate your SedolPay account.<br><br>';
    message += 'Once your account is activated, please login using the Customer ID <b>' + userName + '</b>';

    return message;
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
      regEmail: ['', Validators.compose([Validators.email, Validators.required])],
      curr: ['', Validators.required],
      pass: ['', Validators.required],
      passConfirm: ['', Validators.compose([Validators.required, matchOtherValidator('pass')])],
    });
  }
}
