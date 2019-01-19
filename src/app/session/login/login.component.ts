import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Ims } from '../../models/ims.model';
import { Header } from '../../models/header.model';
import { DataHeader } from '../../models/data-header.model';
import { DataContent } from '../../models/data-content.model';
import { Content } from '../../models/content.model';
import { RequestResponse } from '../../models/request-response.model';
import { ProfileCredential } from '../../models/profile/profile-credential.model';
import { ProfileCurr } from '../../models/profile/profile-curr.model';
import { UserService } from '../shared/services/user.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  validationForm: FormGroup;
  isFailed: boolean;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(private formBuilder: FormBuilder, private userService: UserService,
              private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.createValidationForm();
  }

  login() {
    const request = this.getImsRequestFormat();
    this.userService.login(request).subscribe((data: Ims) => {
      if (data.ims.content.dataheader.status === 'SUCCESS') {
        this.authService.setloginCookies(data.ims.header.token.toString(), data.ims.header.userId.toString(),
                                         data.ims.content.dataheader.custId);
        this.router.navigate(['corporate/dashboard']);
      } else {
        this.isFailed = true;
      }}, error => {
        this.isFailed = true;
      });
  }

  register() {
    this.router.navigate(['register']);
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
           this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  private getImsRequestFormat() {
    const imsRequest = new Ims();
    const header = new Header('2', 'USER', 'AUTH', '');
    const dataHeader = new DataHeader('');
    const dataContent = new DataContent();
    dataContent.acc = new ProfileCurr('USD');
    dataContent.credential = this.getCredential();
    dataContent.docs = [];

    const content = new Content(dataHeader, dataContent);
    const request = new RequestResponse(header, content);
    imsRequest.ims = request;

    return imsRequest;
  }

  private getCredential(): ProfileCredential {
    const credential = new ProfileCredential();
    credential.userName = this.validationForm.controls['userName'].value;
    credential.password = this.validationForm.controls['password'].value;

    return credential;
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
}
