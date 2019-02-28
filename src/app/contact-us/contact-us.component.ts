import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../shared/services/email.service';
import { EmailRequest } from '../shared/models/email-request.model';
import { EmailTemplateParams } from '../shared/models/email-template-params.model';
import { ToastrManager } from 'ng6-toastr-notifications';
import { AppConfigService } from '../shared/services/app-config.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  validationForm: FormGroup;
  isloading = false;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };

  constructor(
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private environmentService: AppConfigService,
    private toastr: ToastrManager) { }

  ngOnInit() {
    this.createValidationForm();
  }

  submitMail() {
    this.isloading = true;
    const request = this.getEmailRequest();
    this.emailService.sendMail(request).subscribe(data => {
      this.toastr.successToastr('An email has been sent to the administrator, someone will get in touch with you shortly.',
        'Email Sent Successfully!');
      this.validationForm.reset();
    }, error => {
      this.toastr.errorToastr('Something went wrong while sending mail.', 'Email Sent Failed!');
    }, () => {
      this.isloading = false;
    });
  }

  getControlBorderColour(control: string): any {
    return this.validationForm.controls[control].touched &&
      this.validationForm.controls[control].invalid ? this.requiredBorder : this.optionalBorder;
  }

  private getEmailRequest(): EmailRequest {
    const emailRequest = new EmailRequest();
    emailRequest.service_id = this.environmentService.environment['email'].service_id;
    emailRequest.template_id = this.environmentService.environment['email'].template_id;
    emailRequest.user_id = this.environmentService.environment['email'].user_id;
    emailRequest.template_params = new EmailTemplateParams();
    emailRequest.template_params.subject = 'New support received';
    emailRequest.template_params.content = this.getMailContent();
    emailRequest.template_params.reply_email = this.validationForm.controls['email'].value;
    return emailRequest;
  }

  private getMailContent(): string {
    let message = '';
    const firstName = this.validationForm.controls['firstName'].value;
    const lastName = this.validationForm.controls['lastName'].value;
    const email = this.validationForm.controls['email'].value;
    const content = this.validationForm.controls['message'].value;

    message += 'You have a new message from ' + firstName + ' ' + lastName + '.';
    message += '<blockquote>';
    message += 'Email: ' + email + '<br>';
    message += 'Message: ' + content;
    message += '</blockquote>';

    return message;
  }

  private createValidationForm() {
    this.validationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      message: ['', Validators.required]
    });
  }
}
