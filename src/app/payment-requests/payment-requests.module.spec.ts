import { PaymentRequestsModule } from './payment-requests.module';

describe('PaymentRequestsModule', () => {
  let paymentRequestsModule: PaymentRequestsModule;

  beforeEach(() => {
    paymentRequestsModule = new PaymentRequestsModule();
  });

  it('should create an instance', () => {
    expect(paymentRequestsModule).toBeTruthy();
  });
});
