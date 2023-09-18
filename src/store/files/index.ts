import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFiles, IFilesSize } from '@uspacy/sdk/lib/models/files';

import { fetchFiles, fetchFilesSize } from './actions';
import { IState } from './types';

const initialState = {
	files: {},
	filesSize: {},
	loadingFiles: false,
	loadingFilesSize: false,
	errorLoadingFiles: null,
	errorLoadingFilesSize: null,
} as IState;

const filesReducer = createSlice({
	name: 'filesReducer',
	initialState,
	reducers: {
		clearFiles: (state) => {
			state.files = {} as IFiles;
		},
	},
	extraReducers: {
		[fetchFiles.fulfilled.type]: (state, action: PayloadAction<IFiles>) => {
			state.loadingFiles = false;
			state.errorLoadingFiles = null;
			state.files.data = action.payload.data;
		},
		[fetchFiles.pending.type]: (state) => {
			state.loadingFiles = true;
			state.errorLoadingFiles = null;
		},
		[fetchFiles.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingFiles = false;
			state.errorLoadingFiles = action.payload;
		},

		[fetchFilesSize.fulfilled.type]: (state, action: PayloadAction<IFilesSize>) => {
			state.loadingFilesSize = false;
			state.errorLoadingFilesSize = null;
			state.filesSize = action.payload;
		},
		[fetchFilesSize.pending.type]: (state) => {
			state.loadingFilesSize = true;
			state.errorLoadingFilesSize = null;
		},
		[fetchFilesSize.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingFilesSize = false;
			state.errorLoadingFilesSize = action.payload;
		},
	},
});

export const { clearFiles } = filesReducer.actions;
export default filesReducer.reducer;
