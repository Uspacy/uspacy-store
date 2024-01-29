import { IDocumentTemplate, IDocumentTemplateFields, IDocumentTemplates } from '@uspacy/sdk/lib/models/crm-document-template';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IDocumentTemplateFieldFilters, IDocumentTemplateFilters } from '@uspacy/sdk/lib/models/crm-filters';

export interface IState {
	template: Partial<IDocumentTemplate>;
	documentTemplates: IDocumentTemplates;
	documentTemplatesFields: IDocumentTemplateFields;
	documentTemplatesFilters: IDocumentTemplateFilters;
	documentTemplatesFieldsFilters: IDocumentTemplateFieldFilters;
	loadingDocumentTemplate: boolean;
	loadingDocumentTemplates: boolean;
	loadingDocumentTemplatesFields: boolean;
	error: IErrors;
}
