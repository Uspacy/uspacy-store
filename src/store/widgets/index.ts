import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';
import { IMeta } from '@uspacy/sdk/lib/models/tasks';

import { createWidget, deleteWidget, getWidgets, updateWidget } from './actions';
import { IState } from './types';

const initialState: IState = {
	widgetData: {
		name: '',
		nameExternalLine: '',
		settings: {
			icon: null,
			welcomeMessage: '',
			iconColor: '',
			backgroundColor: '',
			operatorName: '',
			operatorAvatar: '',
		},
	},
	fields: [],
	widgetsList: [],
	meta: {
		currentPage: 1,
		from: 0,
		lastPage: 1,
		perPage: 0,
		to: 0,
		total: 0,
	},
	loading: false,
};

export const widgetsSlice = createSlice({
	name: 'widgets',
	initialState,
	reducers: {
		setWidgetData: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetData = action.payload;
		},
		updateWidgetData: (
			state,
			action: PayloadAction<{ type: 'body' | 'settings'; data: Partial<ICreateWidgetData>['settings'] | Partial<ICreateWidgetData> }>,
		) => {
			const { type, data } = action.payload;
			if (type === 'body') {
				state.widgetData = { ...state.widgetData, ...data };
			} else if (type === 'settings') {
				state.widgetData.settings = { ...state.widgetData.settings, ...data };
			}
		},
		setWidgetFields: (state, action: PayloadAction<IState['fields']>) => {
			state.fields = action.payload;
		},
	},
	extraReducers: {
		[createWidget.pending.type]: (state) => {
			state.loading = true;
		},
		[createWidget.rejected.type]: (state) => {
			state.loading = false;
		},
		[createWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetsList = [...state.widgetsList, action.payload];
			state.meta.total = state.meta.total + 1;
			state.loading = false;
		},
		[getWidgets.pending.type]: (state) => {
			state.loading = true;
		},
		[getWidgets.rejected.type]: (state) => {
			state.loading = false;
		},
		[getWidgets.fulfilled.type]: (state, action: PayloadAction<{ data: ICreateWidgetData[]; meta: IMeta }>) => {
			state.widgetsList = action.payload.data;
			state.meta = action.payload.meta;
			state.loading = false;
		},
		[deleteWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetsList = state.widgetsList.filter((it) => it.id !== action.payload.id);
		},
		[updateWidget.fulfilled.type]: (state, action: PayloadAction<ICreateWidgetData>) => {
			state.widgetsList = state.widgetsList.map((it) => {
				if (it.id === action.payload.id) return action.payload;
				return it;
			});
		},
	},
});

export const { setWidgetData, updateWidgetData, setWidgetFields } = widgetsSlice.actions;

export default widgetsSlice.reducer;
