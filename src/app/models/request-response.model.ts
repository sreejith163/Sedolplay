import { Content } from './content.model';
import { Header } from './header.model';
import { DataContent } from './data-content.model';
import { GenericContent } from '../shared/models/generic-content.model';

export class RequestResponse {
    header: Header;
    content: Content;
    data: GenericContent;

    constructor(header?: Header, content?: Content) {
        this.header = header;
        this.content = content;
    }
}
