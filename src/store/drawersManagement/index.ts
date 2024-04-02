import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMessengerType } from '@uspacy/sdk/lib/models/messenger';

import { IMessengerDrawerData, IState } from './types';

const initialState: IState = {
	messengerData: {
		type: EMessengerType.INTERNAL_CHAT,
		data: {
			chatId: null,
		},
	},
};

export const drawersSlice = createSlice({
	name: 'messenger',
	initialState,
	reducers: {
		setMessengerDrawerData(state, action: PayloadAction<IMessengerDrawerData>) {
			state.messengerData = action.payload;
		},
		clearDrawerData(state) {
			state.messengerData = initialState.messengerData;
		},
	},
	extraReducers: {},
});

export const { setMessengerDrawerData, clearDrawerData } = drawersSlice.actions;

export default drawersSlice.reducer;
