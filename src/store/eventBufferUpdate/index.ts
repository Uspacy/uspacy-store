import { createSlice } from '@reduxjs/toolkit';

import { IState } from './types';

const initialState: IState = {
	events2: {},
};

const eventBufferUpdateReducer = createSlice({
	name: 'eventBufferUpdate',
	initialState,
	reducers: {},
	extraReducers: {},
});

export default eventBufferUpdateReducer.reducer;
