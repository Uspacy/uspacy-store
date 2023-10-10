import { IFilterPreset } from '@uspacy/sdk/lib/models/filters-presets';
import { ITasksParams } from '@uspacy/sdk/lib/models/tasks';

export interface IState {
	currentFilter: ITasksParams;
	currentFilterRegular: ITasksParams;
	filterPresets: IFilterPreset[];
	filterPresetsRegular: IFilterPreset[];
}
