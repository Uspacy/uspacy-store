import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmailBox, IEmailBoxes, IEmailFilters, IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import {
	connectEmailBox,
	createEmailLetter,
	getEmailBox,
	getEmailFolders,
	getEmailLetter,
	getEmailLetters,
	getEmailsBoxes,
	removeEmailBox,
	removeEmailLetter,
	updateEmailBox,
} from './actions';
import { IState } from './types';

const initialState = {
	emailBoxes: {},
	emailBox: {},
	connectedEmailBox: {},
	folders: {},
	folder: {},
	letters: {},
	letter: {},
	loadingEmailBoxes: false,
	loadingEmailBox: false,
	loadingConnectEmailBox: false,
	loadingUpdateEmailBox: false,
	loadingRemoveEmailBox: false,
	loadingFolders: false,
	loadingLetters: false,
	loadingLetter: false,
	loadingCreatingLetter: false,
	loadingDeletingLetter: false,
	errorLoadingEmailBoxes: null,
	errorLoadingEmailBox: null,
	errorLoadingConnectEmailBox: null,
	errorLoadingUpdateEmailBox: null,
	errorLoadingRemoveEmailBox: null,
	errorLoadingFolders: null,
	errorLoadingLetters: null,
	errorLoadingLetter: null,
	errorLoadingCreatingLetter: null,
	errorLoadingDeletingLetter: null,
	openLetter: false,
	filters: {
		page: 1,
		list: 50,
		is_read: [],
		date: [],
		certainDateOrPeriod_date: [],
		time_label_date: [],
		openCalendar: false,
	},
} as IState;

const emailReducer = createSlice({
	name: 'emailReducer',
	initialState,
	reducers: {
		setEmailBox: (state, action: PayloadAction<IEmailBox>) => {
			state.emailBox = action.payload;
		},
		setConnectedEmailBox: (state, action: PayloadAction<IEmailBox>) => {
			state.connectedEmailBox = action.payload;
		},
		setFolder: (state, action: PayloadAction<IFolder>) => {
			state.folder = action.payload;
		},
		setLetter: (state, action: PayloadAction<ILetter>) => {
			state.letter = action.payload;
		},
		setOpenLetter: (state, action: PayloadAction<boolean>) => {
			state.openLetter = action.payload;
		},
		setFilters: (state, action: PayloadAction<IEmailFilters>) => {
			state.filters = action.payload;
		},
	},
	extraReducers: {
		[getEmailsBoxes.fulfilled.type]: (state, action: PayloadAction<IEmailBoxes>) => {
			state.loadingEmailBoxes = false;
			state.errorLoadingEmailBoxes = null;
			state.emailBoxes = action.payload;
		},
		[getEmailsBoxes.pending.type]: (state) => {
			state.loadingEmailBoxes = true;
			state.errorLoadingEmailBoxes = null;
		},
		[getEmailsBoxes.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailBoxes = false;
			state.errorLoadingEmailBoxes = action.payload;
		},
		[getEmailBox.fulfilled.type]: (state, action: PayloadAction<IEmailBox>) => {
			state.loadingEmailBox = false;
			state.errorLoadingEmailBox = null;
			state.emailBox = action.payload;
		},
		[getEmailBox.pending.type]: (state) => {
			state.loadingEmailBox = true;
			state.errorLoadingEmailBox = null;
		},
		[getEmailBox.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEmailBox = false;
			state.errorLoadingEmailBox = action.payload;
		},
		[connectEmailBox.fulfilled.type]: (state, action: PayloadAction<IEmailBox>) => {
			state.loadingConnectEmailBox = false;
			state.errorLoadingConnectEmailBox = null;
			state.connectedEmailBox = action.payload;
			state.emailBoxes.data = [action.payload, ...state.emailBoxes.data];
		},
		[connectEmailBox.pending.type]: (state) => {
			state.loadingConnectEmailBox = true;
			state.errorLoadingConnectEmailBox = null;
		},
		[connectEmailBox.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingConnectEmailBox = false;
			state.errorLoadingConnectEmailBox = action.payload;
		},
		[updateEmailBox.fulfilled.type]: (state, action: PayloadAction<IEmailBox>) => {
			state.loadingUpdateEmailBox = false;
			state.errorLoadingUpdateEmailBox = null;
			state.emailBoxes.data = state.emailBoxes.data.map((emailBox) => (emailBox.id === action.payload.id ? action.payload : emailBox));
		},
		[updateEmailBox.pending.type]: (state) => {
			state.loadingUpdateEmailBox = true;
			state.errorLoadingUpdateEmailBox = null;
		},
		[updateEmailBox.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdateEmailBox = false;
			state.errorLoadingUpdateEmailBox = action.payload;
		},
		[removeEmailBox.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingDeletingLetter = false;
			state.errorLoadingRemoveEmailBox = null;
			state.emailBoxes.data = state.emailBoxes.data.filter((emailBox) => emailBox.id !== action.payload);
		},
		[removeEmailBox.pending.type]: (state) => {
			state.loadingDeletingLetter = true;
			state.errorLoadingRemoveEmailBox = null;
		},
		[removeEmailBox.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingLetter = false;
			state.errorLoadingRemoveEmailBox = action.payload;
		},
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

export const { setEmailBox, setConnectedEmailBox, setFolder, setLetter, setOpenLetter, setFilters } = emailReducer.actions;
export default emailReducer.reducer;
