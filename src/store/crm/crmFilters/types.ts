import { ICouchItemData } from '@uspacy/sdk/lib/models/couchdb';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';

export interface IState {
	[key: string]: {
		presets: ICouchItemData<IFilterPreset<IFilter>>[];
		filters?: IFilter;
		filterFields?: IFilterField[];
	};
}
