import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';

export interface IState {
	userFilter: {
		presets: IFilterPreset[];
		filters?: IFilter;
		filterFields?: IFilterField[];
	};
}
