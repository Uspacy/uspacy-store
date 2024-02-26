import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFunnel } from '@uspacy/sdk/lib/models/crm-funnel';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { fetchLeadsFunnel } from './actions';
import { IState } from './types';

const initialState = {
	leadsFunnel: [],
	leadsFunnelLoading: false,
	errorMessage: null,
	modalViewMode: false,
} as IState;

const leadsFunnelReducer = createSlice({
	name: 'leadsFunnel',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchLeadsFunnel.fulfilled.type]: (state, action: PayloadAction<IFunnel[]>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = null;
			state.leadsFunnel = action.payload.map((it) => ({ ...it, stages: it.stages.sort((a, b) => a.sort - b.sort) }));
		},
		[fetchLeadsFunnel.pending.type]: (state) => {
			state.leadsFunnelLoading = true;
			state.errorMessage = null;
		},
		[fetchLeadsFunnel.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.leadsFunnelLoading = false;
			state.errorMessage = action.payload;
		},
	},
});
export default leadsFunnelReducer.reducer;
