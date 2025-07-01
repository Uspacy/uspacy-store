import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntity, IEntityData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { ITrashFilter } from '@uspacy/sdk/lib/models/trash-filter';
import { fetchTrashItems } from 'src/store/trash/actions';

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

const normalizeEntities = (dataArray: IEntityData[], code: string): IEntityData[] => {
	return dataArray.map((data) => {
		let normalized = null;

		switch (code) {
			case 'activities':
				normalized = {
					id: data.id,
					title: data.title || '',
					deleted_by: data.changed_by || null,
					owner: data.responsible_id || null,
					deleted_at: data.deleted_at || null,
				};
				break;

			case 'tasks':
				normalized = {
					id: +data.id,
					title: data.title || '',
					deleted_by: +data.changedBy || null,
					owner: +data.responsibleId || null,
					deleted_at: +data.deletedAt || null,
				};
				break;

			default:
				normalized = {
					id: data.id,
				};
				break;
		}

		return normalized;
	});
};

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
