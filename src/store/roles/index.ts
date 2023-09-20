import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IRole } from '@uspacy/sdk/lib/models/roles';

import { fetchRoles } from './actions';
import { IState } from './types';

const initialState = {
	roles: [],
	loadingRoles: false,
	errorLoadingRoles: null,
} as IState;

const rolesReducer = createSlice({
	name: 'rolesReducer',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchRoles.fulfilled.type]: (state, action: PayloadAction<IRole[]>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = null;
			state.roles = action.payload;
		},
		[fetchRoles.pending.type]: (state) => {
			state.loadingRoles = true;
			state.errorLoadingRoles = null;
		},
		[fetchRoles.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingRoles = false;
			state.errorLoadingRoles = action.payload;
		},
	},
});

export default rolesReducer.reducer;
