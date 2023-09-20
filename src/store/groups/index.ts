import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGroup } from '@uspacy/sdk/lib/models/groups';

import { fetchGroup } from './actions';
import { IState } from './types';

const initialState = {
	group: {},
	loadingGroup: false,
	errorLoadingGroup: '',
} as IState;

const groupsReducer = createSlice({
	name: 'groupsReducer',
	initialState,
	reducers: {
		setGroup: (state, action: PayloadAction<IGroup>) => {
			state.group = action.payload;
		},
		clearGroupReducer: (state) => {
			state.group = {} as IGroup;
		},
	},
	extraReducers: {
		[fetchGroup.fulfilled.type]: (state, action: PayloadAction<IGroup>) => {
			state.loadingGroup = false;
			state.errorLoadingGroup = '';
			state.group = action.payload;
		},
		[fetchGroup.pending.type]: (state) => {
			state.loadingGroup = true;
			state.errorLoadingGroup = '';
		},
		[fetchGroup.rejected.type]: (state, action: PayloadAction<string>) => {
			state.loadingGroup = false;
			state.errorLoadingGroup = action.payload;
		},
	},
});

export const { setGroup, clearGroupReducer } = groupsReducer.actions;
export default groupsReducer.reducer;
