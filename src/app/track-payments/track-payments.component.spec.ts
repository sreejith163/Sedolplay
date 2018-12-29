import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackPaymentsComponent } from './track-payments.component';

describe('TrackPaymentsComponent', () => {
  let component: TrackPaymentsComponent;
  let fixture: ComponentFixture<TrackPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
