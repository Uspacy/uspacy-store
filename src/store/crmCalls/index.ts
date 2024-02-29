import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICall, ICalls } from '@uspacy/sdk/lib/models/crm-calls';
import { ICallFilters } from '@uspacy/sdk/lib/models/crm-filters';

import { createCall, deleteCall, editCall, fetchCall, fetchCalls, fetchCallsWithFilters } from './actions';
import { IState } from './types';

const initialCalls = {
	data: [],
	meta: {
		total: 0,
		from: 0,
		per_page: 0,
		list: 0,
	},
};

const initialCallFilter = {
	page: 1,
	perPage: 20,
	status: [],
	openDatePicker: false,
	search: '',
	responsible_id: [],
	durationPeriod: [],
	duration: [],
	interval: [],
	period: [],
	time_label: [],
	certainDateOrPeriod: [],
	participants: [],
	boolean_operator: '',
	type: [],
};

const initialState = {
	calls: initialCalls,
	call: null,
	callFilter: initialCallFilter,
	errorMessage: '',
	loading: false,
	loadingCallList: true,
} as IState;

const callsReducer = createSlice({
	name: 'calls',
	initialState,
	reducers: {
		changeFilterCalls: (state, action: PayloadAction<{ key: string; value: ICallFilters[keyof ICallFilters] }>) => {
			state.callFilter[action.payload.key] = action.payload.value;
		},
		changeItemsFilterCalls: (state, action: PayloadAction<ICallFilters>) => {
			state.callFilter = action.payload;
		},
		addCallToState: (state, action: PayloadAction<ICall>) => {
			state.calls.data = [action.payload, ...state.calls.data];
		},
		removeCallFromState: (state, action: PayloadAction<number>) => {
			state.calls.data = state.calls.data.filter((call) => call.id !== action.payload);
		},
		editCallInState: (state, action: PayloadAction<ICall>) => {
			state.calls.data = state.calls.data.map((call) => (call.id === action.payload.id ? action.payload : call));
		},
		clearCalls: (state) => {
			state.calls = initialCalls;
			state.loadingCallList = true;
		},
		clearCallsFilter: (state) => {
			state.callFilter = initialCallFilter;
		},
	},
	extraReducers: {
		[fetchCalls.fulfilled.type]: (state, action: PayloadAction<ICalls>) => {
			state.loadingCallList = false;
			state.errorMessage = '';
			state.calls = action.payload;
		},
		[fetchCalls.pending.type]: (state) => {
			state.loadingCallList = true;
			state.errorMessage = '';
		},
		[fetchCalls.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingCallList = false;
			state.errorMessage = action.payload;
		},
		[fetchCallsWithFilters.fulfilled.type]: (state, action: PayloadAction<ICalls>) => {
			state.loadingCallList = false;
			state.errorMessage = '';
			state.calls = action.payload;
		},
		[fetchCallsWithFilters.pending.type]: (state) => {
			state.loadingCallList = true;
			state.errorMessage = '';
		},
		[fetchCallsWithFilters.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingCallList = false;
			state.errorMessage = action.payload;
		},
		[createCall.fulfilled.type]: (state, action: PayloadAction<ICall>) => {
			state.loading = false;
			state.errorMessage = '';
			state.calls.data.unshift(action.payload);
			state.calls.meta.total = ++state.calls.meta.total;
		},
		[createCall.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[createCall.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[editCall.fulfilled.type]: (state, action: PayloadAction<ICall>) => {
			state.loading = false;
			state.loadingCallList = false;
			state.errorMessage = '';
			state.calls.data = state.calls.data.map((call) => {
				if (call?.id === action?.payload?.id) {
					return {
						...call,
						...action.payload,
					};
				}
				return call;
			});
		},
		[editCall.pending.type]: (state) => {
			state.loading = true;
			state.loadingCallList = true;
			state.errorMessage = '';
		},
		[editCall.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingCallList = false;
			state.errorMessage = action.payload;
		},
		[fetchCall.fulfilled.type]: (state, action) => {
			state.loading = false;
			state.errorMessage = '';
			state.call = action.payload;
		},
		[fetchCall.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = '';
		},
		[fetchCall.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[deleteCall.fulfilled.type]: (state, action) => {
			state.loading = false;
			state.loadingCallList = false;
			state.errorMessage = '';
			state.calls.data = state.calls.data.filter((el) => el.id !== action.payload);
		},
		[deleteCall.pending.type]: (state) => {
			state.loading = true;
			state.loadingCallList = true;
			state.errorMessage = '';
		},
		[deleteCall.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loading = false;
			state.loadingCallList = false;
			state.errorMessage = action.payload;
		},
	},
});

export const { changeFilterCalls, changeItemsFilterCalls, addCallToState, removeCallFromState, editCallInState, clearCalls, clearCallsFilter } =
	callsReducer.actions;
export default callsReducer.reducer;
