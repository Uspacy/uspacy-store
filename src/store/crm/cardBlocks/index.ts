import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICardBlock } from '@uspacy/sdk/lib/models/crm-card-blocks';

import { IState } from './types';

const initialState: IState = {};

const cardBlocksReducer = createSlice({
	name: 'crm/cardBlocks',
	initialState,
	reducers: {
		setCardBlocks: (state: IState, action: PayloadAction<{ entityCode: string; data: ICardBlock[] }>) => {
			const { entityCode } = action.payload;
			if (!state[entityCode]) {
				state[entityCode] = { data: [] };
			}
			state[entityCode].data = action.payload.data;
		},
	},
	extraReducers: {},
});
export const { setCardBlocks } = cardBlocksReducer.actions;
export default cardBlocksReducer.reducer;
