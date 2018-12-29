import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-account-portfolio',
  templateUrl: './account-portfolio.component.html',
  styleUrls: ['./account-portfolio.component.scss']
})
export class AccountPortfolioComponent implements OnInit {
  type = [
    { value: 'All', label: 'All' },
    { value: 'Savings', label: 'Savings' }
  ];
  currency = [
    { value: 'All', label: 'All' },
    { value: 'USD', label: 'USD' },
    { value: 'EURO', label: 'EURO' }
  ];

  viewcurrency = [
    { value: 'USD', label: 'USD' },
    { value: 'EURO', label: 'EURO' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
