import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IEntity } from '@uspacy/sdk/lib/models/migrations';
import { IMigrationData } from '@uspacy/sdk/lib/services/MigrationsService/dto/get-import-migrations-entities.dto';

import { fetchMigrationEntity } from './actions';
import { IState } from './types';

const initialState = {
	systemEntities: {},
	loadingSystem: false,
	loadingImportSystem: false,
	errorLoadingSystem: null,
	errorLoadingImportSystem: null,
	systemData: [],
} as IState;

const systemEntitiesSlice = createSlice({
	name: 'systemEntities',
	initialState,
	reducers: {
		setSystemData: (state, action: PayloadAction<IMigrationData[]>) => {
			state.systemData = action.payload;
		},
		clearFetchError: (state) => {
			state.errorLoadingSystem = null;
		},
	},
	extraReducers: {
		[fetchMigrationEntity.fulfilled.type]: (state, action: PayloadAction<IEntity>) => {
			state.loadingSystem = false;
			state.errorLoadingSystem = null;
			state.systemEntities = action.payload;
		},
		[fetchMigrationEntity.pending.type]: (state) => {
			state.loadingSystem = true;
			state.errorLoadingSystem = null;
		},
		[fetchMigrationEntity.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingSystem = false;
			state.errorLoadingSystem = action.payload;
		},
	},
});

export const { setSystemData, clearFetchError } = systemEntitiesSlice.actions;

export default systemEntitiesSlice.reducer;
