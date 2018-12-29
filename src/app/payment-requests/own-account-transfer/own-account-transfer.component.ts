import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-own-account-transfer',
  templateUrl: './own-account-transfer.component.html',
  styleUrls: ['./own-account-transfer.component.scss']
})
export class OwnAccountTransferComponent implements OnInit {

  fromaccount = [
    { value: '0999899098USD', label: '0999899098USD' },
    { value: '0999988778EUR', label: '0999988778EUR' }
  ];
  toaccount = [
    { value: '0999899098USD', label: '0999899098USD' },
    { value: '0999988778EUR', label: '0999988778EUR' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
