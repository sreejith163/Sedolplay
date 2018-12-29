import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})

export class TransactionHistoryComponent implements OnInit {

  accountno = [
    { value: 'All', label: 'All' },
    { value: 'USD-987896764', label: 'USD-987896764' },
    { value: 'EUR-987896764', label: 'EUR-987896764' }
  ];
  beneficiary = [
    { value: 'All', label: 'All' },
    { value: 'Benjamin Dow ', label: 'Benjamin Dow ' },
    { value: 'Benjamin Buton ', label: 'Benjamin Buton ' }
  ];
  status = [
    { value: 'All', label: 'All' },
    { value: 'TRANSMITTED', label: 'TRANSMITTED' }
  ];


  constructor() { }

  ngOnInit() {
  }

}
