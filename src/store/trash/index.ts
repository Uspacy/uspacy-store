import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntity } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';

import { normalizeEntities } from '../../helpers/normalizeTrash';
import { fetchTrashItems } from './actions';
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
		entity: 'tasks',
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
			state.filter = { ...initialState.filter, entity: state.filter.entity, sortModel: state?.filter?.sortModel || [] };
		},
		changeFilter: (state, action: PayloadAction<ITrashFilter>) => {
			state.filter = action.payload;
		},
	},
	extraReducers: {
		[fetchTrashItems.pending.type]: (state) => {
			state.loadingItems = true;
			state.errorLoadingItems = null;
		},
		[fetchTrashItems.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingItems = false;
			state.errorLoadingItems = action.payload;
		},
		[fetchTrashItems.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingItems = false;
			state.errorLoadingItems = null;
			state.items = { ...action.payload, data: normalizeEntities(action.payload.data, state.filter.entity) };
		},
	},
});

export const { clearItems, clearFilter, changeFilter } = trashReducer.actions;
export default trashReducer.reducer;
