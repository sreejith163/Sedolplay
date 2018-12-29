import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalTransferComponent } from './external-transfer.component';

describe('ExternalTransferComponent', () => {
  let component: ExternalTransferComponent;
  let fixture: ComponentFixture<ExternalTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
