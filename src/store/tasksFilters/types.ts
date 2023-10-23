import { IFilterPreset } from '@uspacy/sdk/lib/models/filters-presets';

export interface IState {
	isNewPreset: boolean;
	currentPreset: IFilterPreset;
	currentPresetRegular: IFilterPreset;
	standardPreset: IFilterPreset;
	standardPresetRegular: IFilterPreset;
	filterPresets: IFilterPreset[];
	filterPresetsRegular: IFilterPreset[];
}
