import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEntity } from '@uspacy/sdk/lib/models/migrations';
import { IMigrationData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

import { fetchBitrix24 } from './actions';
import { IState } from './types';

const initialState = {
	bitrix24Entities: {},
	loadingBitrix24: false,
	loadingImportBitrix24: false,
	errorLoadingBitrix24: null,
	errorLoadingImportBitrix24: null,
	b24Data: [],
} as IState;

const bitrix24Slice = createSlice({
	name: 'bitrix24Entities',
	initialState,
	reducers: {
		setB24Data: (state, action: PayloadAction<IMigrationData[]>) => {
			state.b24Data = action.payload;
		},
		clearFetchError: (state) => {
			state.errorLoadingBitrix24 = null;
		},
	},
	extraReducers: {
		[fetchBitrix24.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingBitrix24 = false;
			state.errorLoadingBitrix24 = null;
			state.bitrix24Entities = action.payload;
		},
		[fetchBitrix24.pending.type]: (state) => {
			state.loadingBitrix24 = true;
			state.errorLoadingBitrix24 = null;
		},
		[fetchBitrix24.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingBitrix24 = false;
			state.errorLoadingBitrix24 = action.payload;
		},
	},
});

export const { setB24Data, clearFetchError } = bitrix24Slice.actions;

export default bitrix24Slice.reducer;
