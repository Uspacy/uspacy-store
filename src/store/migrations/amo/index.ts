import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEntity } from '@uspacy/sdk/lib/models/migrations';
import { IMigrationData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

import { fetchAmo } from './actions';
import { IState } from './types';

const initialState = {
	amoEntities: {},
	loadingAmo: false,
	errorLoadingAmo: null,
	amoData: [],
} as IState;

const amoSlice = createSlice({
	name: 'amoEntities',
	initialState,
	reducers: {
		setAmoData: (state, action: PayloadAction<IMigrationData[]>) => {
			state.amoData = action.payload;
		},
	},
	extraReducers: {
		[fetchAmo.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingAmo = false;
			state.errorLoadingAmo = null;
			state.amoEntities = action.payload;
		},
		[fetchAmo.pending.type]: (state) => {
			state.loadingAmo = true;
			state.errorLoadingAmo = null;
		},
		[fetchAmo.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingAmo = false;
			state.errorLoadingAmo = action.payload;
		},
	},
});

export const { setAmoData } = amoSlice.actions;

export default amoSlice.reducer;
