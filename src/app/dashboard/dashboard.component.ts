
import { Component, TemplateRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class CorporateDashboardComponent implements OnInit {

  modalRef: BsModalRef;


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  accountno = [
    { value: 'USD-987977890', label: 'USD-987977890' },
    { value: 'EUR-987977890', label: 'EUR-987977890' }
  ];

  constructor(private modalService: BsModalService) { }
  ngOnInit() {
  }

}
