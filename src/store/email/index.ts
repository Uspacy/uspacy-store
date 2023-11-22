import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { createEmailLetter, getEmailFolders, getEmailLetter, getEmailLetters, removeEmailLetter } from './actions';
import { IState } from './types';

const initialState = {
	folders: {},
	folder: {},
	letters: {},
	letter: {},
	loadingFolders: false,
	loadingLetters: false,
	loadingLetter: false,
	loadingCreatingLetter: false,
	loadingDeletingLetter: false,
	errorLoadingFolders: null,
	errorLoadingLetters: null,
	errorLoadingLetter: null,
	errorLoadingCreatingLetter: null,
	errorLoadingDeletingLetter: null,
	openLetter: false,
} as IState;

const emailReducer = createSlice({
	name: 'emailReducer',
	initialState,
	reducers: {
		setFolder: (state, action: PayloadAction<IFolder>) => {
			state.folder = action.payload;
		},
		setLetter: (state, action: PayloadAction<ILetter>) => {
			state.letter = action.payload;
		},
		setOpenLetter: (state, action: PayloadAction<boolean>) => {
			state.openLetter = action.payload;
		},
	},
	extraReducers: {
		[getEmailFolders.fulfilled.type]: (state, action: PayloadAction<IFolders>) => {
			state.loadingFolders = false;
			state.errorLoadingFolders = null;
			state.folders = action.payload;
		},
		[getEmailFolders.pending.type]: (state) => {
			state.loadingFolders = true;
			state.errorLoadingFolders = null;
		},
		[getEmailFolders.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingFolders = false;
			state.errorLoadingFolders = action.payload;
		},
		[getEmailLetters.fulfilled.type]: (state, action: PayloadAction<ILetters>) => {
			state.loadingLetters = false;
			state.errorLoadingLetters = null;
			state.letters = action.payload;
		},
		[getEmailLetters.pending.type]: (state) => {
			state.loadingLetters = true;
			state.errorLoadingLetters = null;
		},
		[getEmailLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingLetters = false;
			state.errorLoadingLetters = action.payload;
		},
		[getEmailLetter.fulfilled.type]: (state, action: PayloadAction<ILetter>) => {
			state.loadingLetter = false;
			state.errorLoadingLetter = null;
			state.letter = action.payload;
		},
		[getEmailLetter.pending.type]: (state) => {
			state.loadingLetter = true;
			state.errorLoadingLetter = null;
		},
		[getEmailLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingLetter = false;
			state.errorLoadingLetter = action.payload;
		},
		[createEmailLetter.fulfilled.type]: (state, action: PayloadAction<ILetter>) => {
			state.loadingCreatingLetter = false;
			state.errorLoadingCreatingLetter = null;
			state.letters.data = [action.payload, ...state.letters.data];
		},
		[createEmailLetter.pending.type]: (state) => {
			state.loadingCreatingLetter = true;
			state.errorLoadingCreatingLetter = null;
		},
		[createEmailLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingLetter = false;
			state.errorLoadingCreatingLetter = action.payload;
		},
		[removeEmailLetter.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingDeletingLetter = false;
			state.errorLoadingDeletingLetter = null;
			state.letters.data = state.letters.data.filter((letter) => letter.id !== action.payload);
		},
		[removeEmailLetter.pending.type]: (state) => {
			state.loadingDeletingLetter = true;
			state.errorLoadingDeletingLetter = null;
		},
		[removeEmailLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingLetter = false;
			state.errorLoadingDeletingLetter = action.payload;
		},
	},
});

export const { setFolder, setLetter, setOpenLetter } = emailReducer.actions;
export default emailReducer.reducer;
