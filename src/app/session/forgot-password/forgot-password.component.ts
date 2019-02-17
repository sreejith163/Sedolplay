import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { matchOtherValidator } from '../shared/validators/match-other-validator';
import { EmailService } from '../../shared/services/email.service';
import { EmailRequest } from '../../shared/models/email-request.model';
import { EmailTemplateParams } from '../../shared/models/email-template-params.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EncrDecrService } from '../../shared/services/encr-decr.service';
import { Ims } from '../../shared/models/ims.model';
import { ProfileCredential } from '../../shared/models/profile-credential.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { Content } from '../../shared/models/content.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { ProfileInfo } from '../../shared/models/profile-info.model';
import { AppConfigService } from '../../shared/services/app-config.service';
import { HttpUrlEncodingCodec } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  validationForm: FormGroup;
  emailForm: FormGroup;
  custId: string;
  isPasswordChangePage = false;
  loading: boolean;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private emailService: EmailService,
    private encrDecrService: EncrDecrService,
    private environmentService: AppConfigService,
    private toastr: ToastrManager,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.createValidationForm();
    this.processResetPassword();
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
      this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  validateUser() {
    this.loading = true;
    const request = this.getImsRequestFormatForEmailValidation();
    this.userService.validateEmail(request).subscribe((data: Ims) => {
      if (data.ims !== undefined && data.ims.content.dataheader.status === 'VALID') {
        this.custId = data.ims.content.dataheader.custId;
        this.sendResetPasswordMail();
      } else {
        this.toastr.errorToastr(data.ims.content.dataheader.comment, 'User Validation Failed!');
      }
    }, error => this.toastr.errorToastr('User is invalid', 'User Validation Failed!'), () => this.loading = false);
  }

  resetPassword() {
    this.loading = true;
    const request = this.getImsRequestFormatForPasswordReset();

    this.userService.resetPassword(request).subscribe((data: Ims) => {
      if (data !== undefined) {
        if (data.ims !== undefined && data.ims.content.dataheader.status === 'SUCCESS') {
          this.toastr.successToastr(data.ims.content.dataheader.comment, 'Password update success!');
          this.router.navigate(['login']);
        } else {
          this.toastr.errorToastr(data.ims.content.dataheader.comment, 'Password update failed!');
        }
      }
    }, error => {
      this.toastr.errorToastr('Something went wrong while updating the password', 'Password update failed!');
    }, () => this.loading = false);
  }

  login() {
    this.router.navigate(['login']);
  }

  getEmailId() {
    return this.emailForm.controls['email'].value;
  }

  private processResetPassword() {
    this.route.queryParams.subscribe(data => {
      if (data !== undefined && data['showView'] !== undefined && data['changeKey'] !== undefined) {
        this.custId = this.encrDecrService.decodeMailContent(data['changeKey']).toString();
        this.loading = true;
        if (this.custId !== undefined && this.custId.length) {
          const custReq = this.getImsRequestFormatForCustomerIdValidation(this.custId);
          this.userService.validateCustId(custReq).subscribe((req: Ims) => {
            if (req.ims !== undefined && req.ims.content.dataheader.status === 'VALID') {
              this.isPasswordChangePage = true;
            } else {
              this.toastr.errorToastr('The requested url request is not valid');
            }
          }, error => console.log(error), () => this.loading = false);
        } else {
          this.toastr.errorToastr('The requested url request is not valid');
          this.loading = false;
        }
      }
    });
  }

  private sendResetPasswordMail() {
    const forgotPassKey = this.encrDecrService.encodeMailContent(this.custId);
    const request = this.getEmailRequestForResetPassword(forgotPassKey);
    this.emailService.sendMail(request).subscribe(data => {
      this.toastr.successToastr('An email has been sent to ' + this.getEmailId() + ', please click the link in the email to ' +
        'change your password.');
      this.validationForm.reset();
      this.router.navigate(['login']);
    }, error => this.toastr.errorToastr('Sending reset password to mail has been failed.', 'Email sent failed!'));
  }

  private getCredential() {
    const credential = new ProfileCredential();
    credential.password = this.encrDecrService.encryptPassword(this.validationForm.controls['pass'].value);

    return credential;
  }

  private getImsRequestFormatForCustomerIdValidation(custId: string) {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'VALIDATECUSTID ');
    const dataHeader = new DataHeader(custId);

    const content = new Content(dataHeader);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getImsRequestFormatForPasswordReset() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'PASSWORDUPDATE');
    const dataHeader = new DataHeader(this.custId);
    const dataContent = new DataContent();
    dataContent.credential = this.getCredential();

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getImsRequestFormatForEmailValidation() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'PASSWORDUPDATE');
    const dataContent = new DataContent();
    dataContent.info = this.getProfileInfo();

    const content = new Content();
    content.data = dataContent;
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getEmailRequestForResetPassword(key: string): EmailRequest {
    const emailRequest = new EmailRequest();
    emailRequest.service_id = this.environmentService.environment['email'].service_id;
    emailRequest.template_id = this.environmentService.environment['email'].template_id;
    emailRequest.user_id = this.environmentService.environment['email'].user_id;
    emailRequest.template_params = new EmailTemplateParams();
    emailRequest.template_params.subject = 'Forgot your password?';
    emailRequest.template_params.content = this.getMailContent(key);
    emailRequest.template_params.reply_email = this.emailForm.controls['email'].value;

    return emailRequest;
  }

  private getProfileInfo(): ProfileInfo {
    const profile = new ProfileInfo();
    profile.email = this.emailForm.controls['email'].value;

    return profile;
  }

  private getMailContent(key: string): string {
    let message = '';
    message += '<b>Password Reset Request</b> <br><br>';
    message += 'Hello, <br><br>';
    message += 'Someone requested that your SedolPay password be reset. <br><br>';
    message += 'If this was a mistake, just ignore this email and nothing will happen. <br><br>';
    message += 'To reset your password, please visit the following url: <br><br>';
    message += 'http://localhost:4200/forgotpass?showView=changePassword&changeKey=' + key;

    return message;
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      pass: ['', Validators.required],
      passConfirm: ['', Validators.compose([Validators.required, matchOtherValidator('pass')])],
    });
    this.emailForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
    });
  }
}
