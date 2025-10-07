import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IDrawerNavItem, IState } from './types';

const initialState: IState = {
	open: false,
	drawers: [],
	activeId: null,
};

export const multiDrawersSlice = createSlice({
	name: 'drawers',
	initialState,
	reducers: {
		addItem(state, action: PayloadAction<IDrawerNavItem>) {
			if (!state.drawers?.some((it) => it.entityCode === action.payload.entityCode && it.entityId === action.payload.entityId)) {
				state.drawers = [action.payload, ...(state?.drawers || [])];
			}
			state.open = true;
			state.activeId = `${action?.payload.entityCode}-${action.payload.entityId}`;
		},
		removeItem(state, action: PayloadAction<IDrawerNavItem>) {
			state.drawers = state.drawers?.filter((it) => it.entityCode !== action?.payload?.entityCode && it.entityId !== action?.payload?.entityId);
			state.activeId = !!state.drawers?.[0]?.entityCode ? `${state.drawers?.[0]?.entityCode}-${state.drawers?.[0]?.entityId}` : null;
			if (!state?.drawers?.length) {
				state.open = false;
			}
		},
		closeAll(state) {
			state.open = true;
			state.drawers = initialState.drawers;
			state.activeId = initialState.activeId;
		},
	},
	extraReducers: {},
});

export const { addItem, removeItem, closeAll } = multiDrawersSlice.actions;

export default multiDrawersSlice.reducer;
