import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IServicesStatus } from '@uspacy/sdk/lib/models/migrations';
import { ISystemStatus } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

import { getSystemStatus } from './actions';

const initialState = {
	systemStatus: {},
	loadingProgress: false,
	errorLoadingProgress: null,
} as ISystemStatus;

const systemStatusSlice = createSlice({
	name: 'systemStatus',
	initialState,
	reducers: {},
	extraReducers: {
		[getSystemStatus.fulfilled.type]: (state, action: PayloadAction<IServicesStatus>) => {
			state.loadingProgress = false;
			state.errorLoadingProgress = null;
			state.systemStatus = action.payload;
		},
		[getSystemStatus.pending.type]: (state) => {
			state.loadingProgress = true;
			state.errorLoadingProgress = null;
		},
		[getSystemStatus.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingProgress = false;
			state.errorLoadingProgress = action.payload;
		},
	},
});

export default systemStatusSlice.reducer;
