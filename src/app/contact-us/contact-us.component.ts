import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../shared/services/email.service';
import { EmailRequest } from '../shared/models/email-request.model';
import { EmailTemplateParams } from '../shared/models/email-template-params.model';
import { ToastrManager } from 'ng6-toastr-notifications';

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
    emailRequest.service_id = 'sedolplay_mail';
    emailRequest.template_id = 'contact';
    emailRequest.user_id = 'user_r1g6gTm4EE5wXwXzxqtEn';
    emailRequest.template_params = new EmailTemplateParams();
    emailRequest.template_params.subject = 'New support received';
    emailRequest.template_params.content = 'You have a new message from ' + this.validationForm.controls['message'].value;
    emailRequest.template_params.reply_email = 'sreejith.jith09@gmail.com';
    return emailRequest;
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
