import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IFiltersPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { ICompanyFilters } from '@uspacy/sdk/lib/models/crm-filters';
import { IFields } from '@uspacy/sdk/lib/models/field';

export interface IState {
	companies: IEntity;
	company: IEntityData;
	companyFields: IFields;
	companyFilters: ICompanyFilters;
	companyFiltersPreset: IFiltersPreset;
	loading: boolean;
	loadingCompanyList: boolean;
	loadingCompanyFields: boolean;
	errorMessage: string;
	cardBlocks: ICardBlock[];
}
