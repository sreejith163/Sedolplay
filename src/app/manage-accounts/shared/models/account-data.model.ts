import { Account } from './account.model';

export class AccountData {
    key?: string;
    viewCur?: Array<string>;
    accounts?: Array<Account>;

    constructor(key?: string, viewCur?: string) {
        this.key = key;
    }
}
