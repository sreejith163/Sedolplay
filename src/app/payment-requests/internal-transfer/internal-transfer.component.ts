import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-internal-transfer',
  templateUrl: './internal-transfer.component.html',
  styleUrls: ['./internal-transfer.component.scss']
})
export class InternalTransferComponent implements OnInit {
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
