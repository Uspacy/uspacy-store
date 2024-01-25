import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IContactFilters, ICreatedAt } from '@uspacy/sdk/lib/models/crm-filters';
import { IFields } from '@uspacy/sdk/lib/models/field';

export interface IState {
	contacts: IEntity;
	contact: IEntityData;
	createdAt: ICreatedAt[];
	contactFields: IFields;
	contactFilters: IContactFilters;
	loading: boolean;
	loadingContactList: boolean;
	loadingsContactFields: boolean;
	errorMessage: string;
	cardBlocks: ICardBlock[];
}
