import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMarketingFilter } from '@uspacy/sdk/lib/models/marketing-filter';

import { IState } from './types';

const initialState = {
	data: {
		page: 1,
		list: 20,
		sections: [],
		status: [],
		presets: [],
		next_run: [],
		created_by: [],
		user_ids: [],
		created_at: [],
		updated_at: [],
		q: '',
		title: '',
		time_label_created_at: [],
		time_label_updated_at: [],
		time_label_next_run: [],
		certainDateOrPeriod: [],
		certainDateOrPeriod_created_at: [],
		certainDateOrPeriod_updated_at: [],
		certainDateOrPeriod_next_run: [],
		openCalendar: false,
	},
} as IState;

const filtersReducer = createSlice({
	name: 'marketing/filters',
	initialState,
	reducers: {
		clearFilters: (state) => {
			state.data = initialState.data;
		},
		setFilters: (state, action: PayloadAction<IMarketingFilter>) => {
			state.data = action.payload;
		},
	},
});

export const { clearFilters, setFilters } = filtersReducer.actions;
export default filtersReducer.reducer;
