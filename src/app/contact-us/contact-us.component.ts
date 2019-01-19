import { Component, OnInit } from '@angular/core';
import { Email } from '../shared/models/email.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { of as observableOf } from 'rxjs';
import { EmailService } from '../shared/services/email.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  validationForm: FormGroup;
  isSent = false;
  isFailed = false;

  requiredBorder = {
    'border-color': 'red',
  };

  optionalBorder = {
    'border-color': 'rgba(0, 0, 0, 0.07)',
  };
  constructor(private formBuilder: FormBuilder, private emailService: EmailService) { }

  ngOnInit() {
    this.createValidationForm();
  }

  submitMail() {
    this.resetAlertControls();
    const email = new Email();
    email.firstName = this.validationForm.controls['firstName'].value;
    email.lastName = this.validationForm.controls['lastName'].value;
    email.email = this.validationForm.controls['email'].value;
    email.message = this.validationForm.controls['message'].value;

    this.emailService.sendMail(email).subscribe(data => {
      this.isSent = true;
      this.validationForm.reset();
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

  private resetAlertControls() {
    this.isSent = false;
    this.isFailed = false;
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
