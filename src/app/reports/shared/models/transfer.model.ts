import { Beneficiary } from '../../../shared/models/beneficiary.model';
import { TxnHistory } from './txn-history.model';
import { TransferCustomer } from './transfer-customer.model';

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
