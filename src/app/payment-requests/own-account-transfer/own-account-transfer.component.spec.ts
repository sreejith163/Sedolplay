import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnAccountTransferComponent } from './own-account-transfer.component';

describe('OwnAccountTransferComponent', () => {
  let component: OwnAccountTransferComponent;
  let fixture: ComponentFixture<OwnAccountTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnAccountTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnAccountTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
