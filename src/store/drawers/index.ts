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
			state.open = true;
			state.activeId = action?.payload.id;
			if (action?.payload?.service === 'messenger') {
				state.drawers = [action?.payload, ...state.drawers?.filter((it) => it.service !== 'messenger')];
				return;
			}
			if (state.drawers?.some((it) => it.entityCode === action.payload.entityCode && it.entityId === action.payload.entityId)) {
				const findItem = state.drawers?.find((it) => it.entityCode === action.payload.entityCode && it.entityId === action.payload.entityId);
				if (findItem?.mode !== action?.payload?.mode) {
					state.drawers = state?.drawers?.map((it) => (it?.id === findItem?.id ? { ...it, ...action.payload } : it));
				}
			} else {
				state.drawers = [action.payload, ...(state?.drawers || [])];
			}
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
		updateItemWhenCreate(state, action: PayloadAction<IDrawerNavItem>) {
			state.drawers = state.drawers?.map((it) =>
				it.mode === 'create' && action.payload.service === it.service && action.payload.entityCode === it.entityCode
					? { ...it, ...action.payload }
					: it,
			);
			if (!!action.payload.id) {
				state.activeId = action.payload.id;
			}
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

export const { addItem, removeItem, closeAll, updateItem, updateActiveId, updateItemWhenCreate } = multiDrawersSlice.actions;

export default multiDrawersSlice.reducer;
