import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@uspacy/sdk/lib/models/user';

import { fetchProfile } from './actions';
import { IState } from './types';

const initialState: IState = {
	loading: true,
	errorLoading: '',
};

export const profileSlice = createSlice({
	name: 'profile',
	initialState,
	reducers: {
		clearProfile(state) {
			state.data = undefined;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
	},
	extraReducers: {
		[fetchProfile.fulfilled.type]: (state: IState, action: PayloadAction<IUser>) => {
			state.loading = false;
			state.data = action.payload;
			state.currentRequestId = undefined;
		},
		[fetchProfile.pending.type]: (state: IState, action: PayloadAction<string, string, { requestId: string }>) => {
			state.loading = true;
			state.errorLoading = '';
			state.currentRequestId = action.meta.requestId;
		},
		[fetchProfile.rejected.type]: (state: IState, action: PayloadAction<string>) => {
			state.loading = false;
			state.errorLoading = action.payload;
			state.currentRequestId = undefined;
		},
	},
});

export default profileSlice.reducer;
