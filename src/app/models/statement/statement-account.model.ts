import { Statement } from './statement.model';

export class StatementAccount {
    cur: string;
    accNo: string;
    curbalance: string;
    availbalance: string;
    type: string;
    viban: string;
    stmt: Array<Statement>;
}
