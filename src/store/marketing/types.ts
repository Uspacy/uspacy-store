import { IEmailNewsletter } from '@uspacy/sdk/lib/models/email-newsletter';
import { IEmailTemplate } from '@uspacy/sdk/lib/models/email-template';
import { IMarketingFilter } from '@uspacy/sdk/lib/models/marketing-filter';

export interface IMassActionsMarketingPayload {
	id: number[];
	payload?: Partial<IEmailTemplate | IEmailNewsletter>;
	all?: boolean;
	params?: Partial<IMarketingFilter>;
}
