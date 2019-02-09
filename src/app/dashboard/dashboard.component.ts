
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class CorporateDashboardComponent implements OnInit {

  accountno = [
    { value: 'USD-987977890', label: 'USD-987977890' },
    { value: 'EUR-987977890', label: 'EUR-987977890' }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }

  routeToSelectedSection(routeName: string) {
    this.router.navigate([routeName]);
  }
}
