import { Beneficiary } from '../beneficiary/beneficiary.model';
import { TransferCustomer } from './transfer-customer.model';
import { TxnHistory } from '../transaction-history/txn-history.model';

export class Transfer {
    chargeBearer: string;
    comments?: string;
    transRef: string;
    transType: string;
    payCur: string;
    benef: Beneficiary;
    type: string;
    txnhistory?: Array<TxnHistory> = [];
    orderCustomer: TransferCustomer;
    payAmt: string;
    remarks: string;
    payDate: string;
    status?: string;
    timestamp?: Date;
}
