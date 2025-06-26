import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';

import { IState } from './types';

const initialState = {
	items: {
		data: [],
		meta: null,
		aborted: false,
	},
	filter: {
		page: 1,
		list: 20,
		q: '',
		owner: [],
		deleted_by: [],
		created_at: [],
		deleted_at: [],
		time_label_created_at: [],
		time_label_deleted_at: [],
		certainDateOrPeriod_created_at: [],
		certainDateOrPeriod_deleted_at: [],
		openCalendar: false,
	},
	loadingItems: false,
	errorLoadingItems: null,
} as IState;

const trashReducer = createSlice({
	name: 'trashReducer',
	initialState,
	reducers: {
		clearItems: (state) => {
			state.items = initialState.items;
		},
		clearFilter: (state) => {
			state.filter = initialState.filter;
		},
		changeFilter: (state, action: PayloadAction<ITrashFilter>) => {
			state.filter = action.payload;
		},
	},
	extraReducers: {},
});

export const { clearItems, clearFilter, changeFilter } = trashReducer.actions;
export default trashReducer.reducer;
