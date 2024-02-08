import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { fetchDealsFunnel } from './actions';
import { IState } from './types';

const initialState = {
	dealsFunnel: [],
	dealsFunnelLoading: false,
	errorMessage: null,
	modalViewMode: false,
} as IState;

const dealsFunnelReducer = createSlice({
	name: 'dealsFunnel',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchDealsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel[]>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = null;
			state.dealsFunnel = action.payload.map((it) => ({ ...it, stages: it.stages.sort((a, b) => a.sort - b.sort) }));
		},
		[fetchDealsFunnel.pending.type]: (state) => {
			state.dealsFunnelLoading = true;
			state.errorMessage = null;
		},
		[fetchDealsFunnel.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.dealsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
	},
});
export default dealsFunnelReducer.reducer;
