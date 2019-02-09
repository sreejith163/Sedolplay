import { DataHeader } from './data-header.model';
import { DataContent } from './data-content.model';

export class Content {
    dataheader: DataHeader;
    data: DataContent;

    constructor(dataheader?: DataHeader, data?: DataContent) {
        this.dataheader = dataheader;
        this.data = data;
    }
}
