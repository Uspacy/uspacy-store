import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

import { createWidget, deleteWidget, getWidgets, updateWidget } from './actions';
import { IState } from './types';

const initialState: IState = {
	widgets: {
		data: [],
		meta: {
			currentPage: 1,
			from: 0,
			lastPage: 1,
			perPage: 0,
			to: 0,
			total: 0,
		},
		loading: false,
	},
};

export const widgetsSlice = createSlice({
	name: 'widgets',
	initialState,
	reducers: {},
	extraReducers: {
		[createWidget.pending.type]: (state) => {
			state.widgets.loading = true;
		},
		[createWidget.rejected.type]: (state) => {
			state.widgets.loading = false;
		},
		[createWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgets.data = [...state.widgets.data, action.payload];
			state.widgets.meta.total = state.widgets.meta.total + 1;
			state.widgets.loading = false;
		},
		[getWidgets.pending.type]: (state) => {
			state.widgets.loading = true;
		},
		[getWidgets.rejected.type]: (state) => {
			state.widgets.loading = false;
		},
		[getWidgets.fulfilled.type]: (state, action: PayloadAction<{ data: ICreateWidgetData[]; meta: IMeta }>) => {
			state.widgets.data = action.payload.data;
			state.widgets.meta = action.payload.meta;
			state.widgets.loading = false;
		},
		[deleteWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgets.data = state.widgets.data.filter((it) => it.id !== action.payload.id);
		},
		[updateWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgets.data = state.widgets.data.map((it) => {
				if (it.id === action.payload.id) return action.payload;
				return it;
			});
		},
	},
});

export const {} = widgetsSlice.actions;

export default widgetsSlice.reducer;
