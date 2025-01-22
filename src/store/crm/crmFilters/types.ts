/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFilter } from '@uspacy/sdk/lib/models/crm-filters';
import { IFilterField, IFilterPreset } from '@uspacy/sdk/lib/models/filter-preset';

export interface IState {
	_id: string;
	_rev: string;
	type: string;
	data: {
		presets: IFilterPreset<IFilter>[];
		filters?: IFilter;
		filterFields?: IFilterField[];
	};
}
