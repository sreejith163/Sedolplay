
import { Component, TemplateRef, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class CorporateDashboardComponent implements OnInit {

  modalRef: BsModalRef;

  accountno = [
    { value: 'USD-987977890', label: 'USD-987977890' },
    { value: 'EUR-987977890', label: 'EUR-987977890' }
  ];

  constructor(private modalService: BsModalService, private router: Router) { }

  ngOnInit() {
  }

  routeToSelectedSection(routeName: string) {
    this.router.navigate([routeName]);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
