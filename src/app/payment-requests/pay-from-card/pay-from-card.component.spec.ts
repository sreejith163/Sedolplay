import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayFromCardComponent } from './pay-from-card.component';

describe('PayFromCardComponent', () => {
  let component: PayFromCardComponent;
  let fixture: ComponentFixture<PayFromCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayFromCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayFromCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
