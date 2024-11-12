import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IState } from './types';

const initialState: IState = {
	isBannerExists: false,
};

export const announcersSlice = createSlice({
	name: 'announcersReducer',
	initialState,
	reducers: {
		setBannerExists: (state, action: PayloadAction<boolean>) => {
			state.isBannerExists = action.payload;
		},
	},
	extraReducers: {},
});

export const { setBannerExists } = announcersSlice.actions;

export default announcersSlice.reducer;
