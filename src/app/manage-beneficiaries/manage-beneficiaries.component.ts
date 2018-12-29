import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-beneficiaries',
  templateUrl: './manage-beneficiaries.component.html',
  styleUrls: ['./manage-beneficiaries.component.scss']
})
export class ManageBeneficiariesComponent implements OnInit {
  type = [
    { value: 'Internal', label: 'Internal' },
    { value: 'External', label: 'External' }
  ];
  selecteCountryThree;
  selecteCountryThree1;

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

  currency = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' }
  ];

  IsHidden = true;

  onSelect() {
    this.IsHidden = !this.IsHidden;
  }

  constructor() { }

  ngOnInit() {
  }

}
