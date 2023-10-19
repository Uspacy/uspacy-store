import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { stopImport } from './actions';

const initialState = {
	systemStatus: {},
	loading: false,
	error: null,
};

const systemStatusSlice = createSlice({
	name: 'systemStatus',
	initialState,
	reducers: {},
	extraReducers: {
		[stopImport.fulfilled.type]: (state, action) => {
			state.loading = false;
			state.error = null;
			state.systemStatus = action.payload;
		},
		[stopImport.pending.type]: (state) => {
			state.loading = true;
			state.error = null;
		},
		[stopImport.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export default systemStatusSlice.reducer;
