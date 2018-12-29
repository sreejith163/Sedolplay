import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPortfolioComponent } from './account-portfolio.component';

describe('AccountPortfolioComponent', () => {
  let component: AccountPortfolioComponent;
  let fixture: ComponentFixture<AccountPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
