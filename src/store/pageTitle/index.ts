import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IState, PageTitleLayer } from './types';

const initialState: IState = {
	section: null,
	card: null,
};

const pageTitleSlice = createSlice({
	name: 'pageTitle',
	initialState,
	reducers: {
		setPageTitle: (state, action: PayloadAction<{ layer: PageTitleLayer; title: string | null }>) => {
			state[action.payload.layer] = action.payload.title || null;
		},
		clearPageTitle: (state, action: PayloadAction<PageTitleLayer>) => {
			state[action.payload] = null;
		},
	},
});

export const { setPageTitle, clearPageTitle } = pageTitleSlice.actions;

export default pageTitleSlice.reducer;
