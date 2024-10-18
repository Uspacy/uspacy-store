import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEntityMainData } from '@uspacy/sdk/lib/models/crm-entities';
import { IErrors } from '@uspacy/sdk/lib/models/crm-errors';
import { IResponseWithMeta } from '@uspacy/sdk/lib/models/response';

import { staticEntities } from '../../../const';
import { createEntity, deleteEntity, fetchEntities, fetchEntitiesWithFunnels, updateEntity } from './actions';
import { IState } from './types';

const initialState: IState = {
	loading: true,
};

const entitiesReducer = createSlice({
	name: 'crm/entities',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchEntities.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IEntityMainData>>) => {
			state.loading = false;
			state.errorMessage = null;
			action.payload.data = [...action.payload.data, ...staticEntities];
			state.items = action.payload;
		},
		[fetchEntities.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchEntities.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},
		[fetchEntitiesWithFunnels.fulfilled.type]: (state, action: PayloadAction<IResponseWithMeta<IEntityMainData>>) => {
			state.loading = false;
			state.errorMessage = null;
			action.payload.data = [...action.payload.data, ...staticEntities];
			state.itemsWithFunnels = action.payload;
		},
		[fetchEntitiesWithFunnels.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},
		[fetchEntitiesWithFunnels.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},

		[updateEntity.fulfilled.type]: (state, action: PayloadAction<IEntityMainData, string, { arg: IEntityMainData }>) => {
			state.items.data = state.items.data.map((entity) => {
				if (entity.id === action.meta.arg.id) {
					return { ...entity, ...action.payload };
				}
				return entity;
			});
		},

		[deleteEntity.fulfilled.type]: (state, action: PayloadAction<IEntityMainData, string, { arg: number }>) => {
			state.items.data = state.items.data.filter((entity) => entity.id !== action.meta.arg);
		},

		[createEntity.pending.type]: (state) => {
			state.loading = true;
			state.errorMessage = null;
		},

		[createEntity.rejected.type]: (state, action: PayloadAction<IErrors>) => {
			state.loading = false;
			state.errorMessage = action.payload;
		},

		[createEntity.fulfilled.type]: (state, action: PayloadAction<IEntityMainData>) => {
			state.loading = false;
			state.items.data = [...state.items.data, action.payload];
			state.errorMessage = null;
		},
	},
});
export const {} = entitiesReducer.actions;
export default entitiesReducer.reducer;
