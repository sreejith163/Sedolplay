import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-external-transfer',
  templateUrl: './external-transfer.component.html',
  styleUrls: ['./external-transfer.component.scss']
})
export class ExternalTransferComponent implements OnInit {
  paymenttype = [
    { value: 'Payments', label: 'Payments' },
    { value: 'FX', label: 'FX' },
    { value: 'Transfer', label: 'Transfer' }
  ];
  fromaccount = [
    { value: '0999899098USD', label: '0999899098USD' },
    { value: '0999988778EUR', label: '0999988778EUR' }
  ];
  type = [
    { value: 'IBAN', label: 'IBAN' },
    { value: 'V-IBAN', label: 'V_IBAN' }
  ];
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

  constructor() { }

  ngOnInit() {
  }

}
