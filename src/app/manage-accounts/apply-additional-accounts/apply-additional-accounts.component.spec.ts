import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyAdditionalAccountsComponent } from './apply-additional-accounts.component';

describe('ApplyAdditionalAccountsComponent', () => {
  let component: ApplyAdditionalAccountsComponent;
  let fixture: ComponentFixture<ApplyAdditionalAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyAdditionalAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyAdditionalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
