import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDataPresence } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

import { getDataPresence } from './actions';
import { IState } from './types';

const initialState = {
	companyInfo: {},
	loadingCompanyInfo: false,
	errorCompanyInfo: false,
} as IState;

const dataPresence = createSlice({
	name: 'presenceData',
	initialState,
	reducers: {},
	extraReducers: {
		[getDataPresence.fulfilled.type]: (state, action: PayloadAction<IDataPresence>) => {
			state.loadingCompanyInfo = false;
			state.errorCompanyInfo = null;
			state.companyInfo = action.payload;
		},
		[getDataPresence.pending.type]: (state) => {
			state.loadingCompanyInfo = true;
			state.errorCompanyInfo = null;
		},
		[getDataPresence.rejected.type]: (state) => {
			state.loadingCompanyInfo = false;
			state.errorCompanyInfo = true;
		},
	},
});

export default dataPresence.reducer;
