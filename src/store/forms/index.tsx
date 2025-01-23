import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IState } from './types';

const initialState = {
	formFields: {
		fields: [],
		other: [],
	},
} as IState;

const formsReducer = createSlice({
	name: 'filesReducer',
	initialState,
	reducers: {
		setFormFields: (state, action: PayloadAction<IState['formFields']>) => {
			state.formFields = action.payload;
		},
	},
});

export const { setFormFields } = formsReducer.actions;
export default formsReducer.reducer;
