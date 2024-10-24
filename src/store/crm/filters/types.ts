import { IFilterPreset } from '@uspacy/sdk/lib/models/crm-filter-field';
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';

export interface IState {
	[key: string]: {
		presets: IFilterPreset[];
		filters?: IFilter;
	};
}
