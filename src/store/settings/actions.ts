import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IPortalSettings } from '@uspacy/sdk/lib/models/settings';

export const selectTotalSettings = (personalSettings: IPortalSettings, portalSettings: IPortalSettings): IPortalSettings => {
	const totalSettings = {};

	Object.keys({ ...portalSettings, ...personalSettings }).forEach((key) => {
		const personalValue = personalSettings[key];
		const portalValue = portalSettings[key];
		if (personalValue && Boolean(personalValue)) {
			return (totalSettings[key] = personalValue);
		} else {
			return (totalSettings[key] = portalValue);
		}
	});

	return totalSettings as IPortalSettings;
};

export const getPersonalSettings = async (portalSettings: IPortalSettings) => {
	try {
		const { data: currentPersonalSettings } = await uspacySdk.profileService.getPortalSettings();
		const personalSettings = portalSettings?.themeCustomization
			? currentPersonalSettings
			: {
					...currentPersonalSettings,
					themeAccentColor: portalSettings?.themeAccentColor,
					themeName: portalSettings?.themeName,
					themeDecor: portalSettings?.themeDecor,
			  };
		return personalSettings;
	} catch (e) {
		// eslint-disable-next-line no-console
		console.error(e, 'Error by get personal settings');
		return null;
	}
};

export const fetchSettings = createAsyncThunk<IPortalSettings>('settings/fetchSettings', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.settingsService.getPortalSettings();
		const portalSettings = res.data as IPortalSettings;

		const personalSettings = await getPersonalSettings(portalSettings);

		return selectTotalSettings(personalSettings, portalSettings);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateSettings = createAsyncThunk('settings/updateSettings', async (data: Partial<IPortalSettings>, thunkAPI) => {
	try {
		const res = await uspacySdk.settingsService.updatePortalSettings(data);

		const personalSettings = await getPersonalSettings(res?.data);

		return selectTotalSettings(personalSettings, res?.data);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
