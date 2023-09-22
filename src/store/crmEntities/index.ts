import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntityMain } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { fetchEntities } from './actions';
import { IState } from './types';

const initialState = {
	entities: {
		data: [],
		meta: {
			total: 0,
			per_page: 0,
			from: 0,
			list: 0,
		},
	},
	errorMessage: null,
	loading: false,
} as IState;

const entitiesReducer = createSlice({
	name: 'entities',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchEntities.fulfilled.type]: (state, action: PayloadAction<IEntityMain>) => {
			state.loading = false;
			state.errorMessage = null;
			state.entities = action.payload;
		},
		[fetchEntities.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchEntities.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
	},
});

export default entitiesReducer.reducer;
