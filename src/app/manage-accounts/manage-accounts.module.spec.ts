import { ManageAccountsModule } from './manage-accounts.module';

describe('ManageAccountsModule', () => {
  let manageAccountsModule: ManageAccountsModule;

  beforeEach(() => {
    manageAccountsModule = new ManageAccountsModule();
  });

  it('should create an instance', () => {
    expect(manageAccountsModule).toBeTruthy();
  });
});
