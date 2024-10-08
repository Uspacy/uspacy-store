import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IPortalSettings } from '@uspacy/sdk/lib/models/settings';

import { fetchSettings } from './actions';
import { IState } from './types';

const initialState: IState = {};

const settingsReducer = createSlice({
	name: 'settingsReducer',
	initialState,
	reducers: {
		setUserSettings: (state, action: PayloadAction<IPortalSettings>) => {
			state.data = action.payload;
		},
		setDateLocale: (state, action: PayloadAction<Locale>) => {
			state.dateLocale = action.payload;
		},
	},
	extraReducers: {
		[fetchSettings.fulfilled.type]: (state, action: PayloadAction<IPortalSettings>) => {
			state.loading = false;
			state.error = null;
			state.data = action.payload;
		},
		[fetchSettings.pending.type]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[fetchSettings.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { setUserSettings, setDateLocale } = settingsReducer.actions;
export default settingsReducer.reducer;
