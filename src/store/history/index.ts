import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IHistoryResponse } from '@uspacy/sdk/lib/models/history';

import { fetchChangesHistory } from './actions';
import { IState } from './types';

const initialState = {
	history: {},
	loadingHistory: false,
	errorLoadingErrors: null,
} as IState;

const historyReducer = createSlice({
	name: 'historyReducer',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchChangesHistory.fulfilled.type]: (state, action: PayloadAction<IHistoryResponse>) => {
			state.loadingHistory = false;
			state.errorLoadingErrors = null;
			state.history.data = action.payload.data;
			state.history.meta = action.payload.meta;
		},
		[fetchChangesHistory.pending.type]: (state) => {
			state.loadingHistory = true;
			state.errorLoadingErrors = null;
		},
		[fetchChangesHistory.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingHistory = false;
			state.errorLoadingErrors = action.payload;
		},
	},
});

export default historyReducer.reducer;
