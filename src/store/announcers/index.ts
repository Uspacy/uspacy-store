import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ResponseApi } from '@uspacy/sdk/lib/services/AnnouncersService/dto/announcers-dto';

import { fetchAnnouncers } from './actions';
import { IState } from './types';

const initialState: IState = {
	loadingAnnouncers: false,
	errorLoading: false,
	isBannerExists: false,
	announcers: {
		data: {
			id: 0,
			attributes: {
				notifications: [],
				widgets: [],
				banner: null,
			},
		},
		meta: {
			pagination: {
				page: 0,
				pageSize: 0,
				pageCount: 0,
				total: 0,
			},
		},
	},
};

export const announcersSlice = createSlice({
	name: 'announcersReducer',
	initialState,
	reducers: {
		setBannerExists: (state, action: PayloadAction<boolean>) => {
			state.isBannerExists = action.payload;
		},
	},
	extraReducers: {
		[fetchAnnouncers.fulfilled.type]: (state, action: PayloadAction<ResponseApi>) => {
			state.loadingAnnouncers = false;
			state.errorLoading = null;
			state.announcers = action.payload;
		},
		[fetchAnnouncers.pending.type]: (state) => {
			state.loadingAnnouncers = true;
			state.errorLoading = null;
		},
		[fetchAnnouncers.rejected.type]: (state) => {
			state.loadingAnnouncers = false;
			state.errorLoading = true;
		},
	},
});

export const { setBannerExists } = announcersSlice.actions;

export default announcersSlice.reducer;
