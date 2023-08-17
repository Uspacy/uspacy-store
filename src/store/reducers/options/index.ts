import { createSlice } from '@reduxjs/toolkit';

import { IState } from './types';

const initialState: IState = {
	count: 0,
};

export const optionsReducer = createSlice({
	name: 'companies',
	initialState,
	reducers: {
		increase(state) {
			state.count++;
		},
		decrease(state) {
			state.count--;
		},
	},
});

export const { increase, decrease } = optionsReducer.actions;

export default optionsReducer.reducer;
