import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IPortalSettings } from '@uspacy/sdk/lib/models/settings';

import { API_PREFIX_SETTINGS } from '../../const';

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

export const fetchSettings = createAsyncThunk<IPortalSettings>('settings/fetchSettings', async (_, thunkAPI) => {
	try {
		const domain = await uspacySdk.tokensService.getDomain();
		const { data: portalSettings } = await uspacySdk.httpClient.client.get<IPortalSettings>(
			`${API_PREFIX_SETTINGS}/settings/general?domain=${domain}`,
		);

		const { data: currentPersonalSettings } = await uspacySdk.profileService.getPortalSettings();
		const personalSettings = portalSettings?.themeCustomization
			? currentPersonalSettings
			: {
					...currentPersonalSettings,
					themeAccentColor: portalSettings?.themeAccentColor,
					themeName: portalSettings?.themeName,
					themeDecor: portalSettings?.themeDecor,
			  };

		return selectTotalSettings(personalSettings, portalSettings);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
