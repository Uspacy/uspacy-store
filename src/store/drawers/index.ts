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
			state.drawers = state.drawers?.filter((it) => it.id !== action?.payload?.id);
			state.activeId = !!state.drawers?.[0]?.entityCode ? `${state.drawers?.[0]?.entityCode}-${state.drawers?.[0]?.entityId}` : null;
			if (!state?.drawers?.length) {
				state.open = false;
			}
		},
		updateItem(state, action: PayloadAction<IDrawerNavItem>) {
			state.drawers = state.drawers?.map((it) => (it.id === action?.payload?.id ? { ...it, ...action.payload } : it));
		},
		updateActiveId(state, action: PayloadAction<string | null>) {
			state.activeId = action.payload;
		},
		closeAll(state) {
			state.open = false;
			state.drawers = initialState.drawers;
			state.activeId = initialState.activeId;
		},
	},
	extraReducers: {},
});

export const { addItem, removeItem, closeAll, updateItem, updateActiveId } = multiDrawersSlice.actions;

export default multiDrawersSlice.reducer;
