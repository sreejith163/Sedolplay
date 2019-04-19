export class Header {
    branchId: String = '';
    clientId: String = '';
    err: String = '';
    auth: String = '';
    deptId: String = '';
    type: String = '';
    userId: String = '';
    mode: String = '';
    ref: String = '';
    from: String = 'SEDOLPAY';
    comment: String = '';
    to: String = 'ECS';
    usertimezone: string;
    userType: String = '';
    timestamp: Date = new Date();
    token: String = '';

    constructor(clientid: string, type: string, mode: string, usertimezone: string) {
        this.clientId = clientid;
        this.type = type;
        this.mode = mode;
        this.usertimezone = usertimezone;
    }
}
