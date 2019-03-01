import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { EncrDecrService } from '../../shared/services/encr-decr.service';
import { Ims } from '../../shared/models/ims.model';
import { Header } from '../../shared/models/header.model';
import { DataHeader } from '../../shared/models/data-header.model';
import { DataContent } from '../../shared/models/data-content.model';
import { Content } from '../../shared/models/content.model';
import { RequestResponse } from '../../shared/models/request-response.model';
import { ProfileInfo } from '../../shared/models/profile-info.model';
import { ProfileCredential } from '../../shared/models/profile-credential.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
    private userService: UserService,
    private authService: AuthenticationService,
    private encrDecrService: EncrDecrService,
    private toastr: ToastrManager,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.createValidationForm();
    this.processActivation();
  }

  login() {
    this.loading = true;
    const request = this.getImsRequestFormatForAuthentication();
    this.userService.login(request).subscribe((data: Ims) => {
      if (data.ims !== undefined && data.ims.content.dataheader.status === 'SUCCESS') {
        this.authService.setloginCookies(this.validationForm.controls['userName'].value,
                                         data.ims.content.dataheader.custId);
        this.toastr.successToastr('Login Successfull');
        this.router.navigate(['corporate/dashboard']);
      } else {
        this.toastr.errorToastr('Login Failed!');
      }}, error => {
        this.toastr.errorToastr('Login Failed!');
      }, () => this.loading = false);
  }

  register() {
    this.router.navigate(['register']);
  }

  forgotPass() {
    this.router.navigate(['forgotpass']);
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  private processActivation() {
    this.route.queryParams.subscribe(data => {
      if (data !== undefined && data['key'] !== undefined) {
        this.loading = true;
        const decryptedKey = this.encrDecrService.decodeMailContent(data['key']).toString();
        const userName = this.getActualValueFromQueryString(decryptedKey.split('&')[0]);
        const email = this.getActualValueFromQueryString(decryptedKey.split('&')[1]);

        if (userName !== undefined && email !== undefined) {
          const userRequest = this.getImsRequestFormatForUserIdValidation(userName, email);
          this.userService.validateUserId(userRequest).subscribe((req: Ims) => {
            if (req.ims !== undefined && req.ims.content.dataheader.status === 'VALID') {
              const request = this.getImsRequestFormatForUserActivation(userName);
              this.userService.activate(request).subscribe((resp: Ims) => {
                if (resp !== undefined && resp.ims.content.dataheader.status === 'SUCCESS') {
                  this.toastr.successToastr('Email verification has been completed. You can login.', 'Email verification completed');
                } else {
                  this.toastr.errorToastr('Email verification failed.');
                }
              }, error => console.log(error), () => this.loading = false);
            } else {
              this.toastr.errorToastr('Email verification failed.');
              this.loading = false;
            }
          });
        } else {
          this.toastr.errorToastr('Email verification failed.');
          this.loading = false;
        }
      }
    });
  }

  private getImsRequestFormatForAuthentication() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'AUTH');
    const dataHeader = new DataHeader('');
    const dataContent = new DataContent();
    dataContent.credential = this.getCredentialForLogin();

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getImsRequestFormatForUserIdValidation(userName: string, email: string) {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'VALIDATEUSER');
    const dataContent = new DataContent();
    dataContent.credential = new ProfileCredential();
    dataContent.credential.userName = userName;
    dataContent.info = new ProfileInfo();
    dataContent.info.email = email;

    const content = new Content();
    content.data = dataContent;
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getImsRequestFormatForUserActivation(userName: string) {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'SIGNUP');
    const dataHeader = new DataHeader('');
    const dataContent = new DataContent();
    dataContent.credential = this.getCredentialForActivation(userName);
    dataContent.info = this.getProfileInfo();

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getProfileInfo(): ProfileInfo {
    const profile = new ProfileInfo();
    profile.active = 'Y';

    return profile;
  }

  private getCredentialForLogin(): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = this.validationForm.controls['userName'].value;
    credential.password = this.encrDecrService.encryptPassword(this.validationForm.controls['password'].value);

    return credential;
  }

  private getCredentialForActivation(userName: string): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = userName;

    return credential;
  }

  private getActualValueFromQueryString(value) {
    const startPosition = value.lastIndexOf('=');
    return value.substring(startPosition + 1, value.length);
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
