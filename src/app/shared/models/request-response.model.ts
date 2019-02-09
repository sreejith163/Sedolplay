import { Content } from './content.model';
import { Header } from './header.model';
import { GenericContent } from './generic-content.model';

export class RequestResponse {
    header: Header;
    content: Content;
    data: GenericContent;

    constructor(header?: Header, content?: Content) {
        this.header = header;
        this.content = content;
    }
}
