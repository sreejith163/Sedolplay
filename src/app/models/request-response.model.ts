import { Content } from './content.model';
import { Header } from './header.model';

export class RequestResponse {
    header: Header;
    content: Content;

    constructor(header: Header, content: Content) {
        this.header = header;
        this.content = content;
    }
}
