export class DataHeader {
    custId: string;
    portalUserid?: string;
    status?: string;
    comment?: string;
    userName?: string;
    pass?: string;
    fromDate?: any;
    stmtcnt?: string;
    toDate?: any ;
    err?: string;
    payBatchId?: string;
    txnCnt?: string;

    constructor(custId: string, portalUserid?: string, status?: string, comment?: string, userName?: string,
        pass?: string, fromDate?: any, stmtcnt?: string, toDate?: any, err?: string, payBatchId?: string,
        txnCnt?: string) {
        this.custId = custId;
        this.portalUserid = portalUserid;
        this.status = status;
        this.comment = comment;
        this.userName = userName;
        this.pass = pass;
        this.err = err;
        this.toDate = toDate;
        this.payBatchId = payBatchId;
        this.fromDate = fromDate;
        this.stmtcnt = stmtcnt;
        this.txnCnt = txnCnt;
    }
}
