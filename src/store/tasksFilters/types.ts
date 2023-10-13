import { IFilterPreset } from '@uspacy/sdk/lib/models/filters-presets';

export interface IState {
	currentPreset: IFilterPreset;
	currentPresetRegular: IFilterPreset;
	standardPreset: IFilterPreset;
	standardPresetRegular: IFilterPreset;
	addedFilterPreset: IFilterPreset;
	addedFilterPresetRegular: IFilterPreset;
	filterPresets: IFilterPreset[];
	filterPresetsRegular: IFilterPreset[];
}
