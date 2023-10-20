import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IServicesStatus } from '@uspacy/sdk/lib/models/migrations';
import { ISystemStatus } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

import { getAllSystemsStatus } from './actions';

const initialState = {
	allSystemsStatus: {},
	loadingProgress: false,
	errorLoadingProgress: null,
} as ISystemStatus;

const systemStatusSlice = createSlice({
	name: 'allSystemsStatus',
	initialState,
	reducers: {},
	extraReducers: {
		[getAllSystemsStatus.fulfilled.type]: (state, action: PayloadAction<IServicesStatus>) => {
			state.loadingProgress = false;
			state.errorLoadingProgress = null;
			state.allSystemsStatus = action.payload;
		},
		[getAllSystemsStatus.pending.type]: (state) => {
			state.loadingProgress = true;
			state.errorLoadingProgress = null;
		},
		[getAllSystemsStatus.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingProgress = false;
			state.errorLoadingProgress = action.payload;
		},
	},
});

export default systemStatusSlice.reducer;
