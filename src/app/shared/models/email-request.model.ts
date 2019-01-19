import { EmailTemplateParams } from './email-template-params.model';

export class EmailRequest {
    service_id: string;
    template_id: string;
    user_id: string;
    template_params: EmailTemplateParams;
}
