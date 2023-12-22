import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEmailBox, IEmailBoxes, IEmailFilters, IFolder, IFolders, ILetter, ILetters } from '@uspacy/sdk/lib/models/email';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import {
	connectEmailBox,
	createEmailLetter,
	getEmailBox,
	getEmailChainLetters,
	getEmailFolders,
	getEmailLetter,
	getEmailLetters,
	getEmailsBoxes,
	moveLetter,
	moveLetters,
	readEmailLetters,
	removeEmailBox,
	removeEmailLetter,
	setupEmailBox,
	unreadEmailLetters,
	updateEmailBox,
	updateEmailBoxCredentials,
} from './actions';
import { createNewLetterModeType, headerTypes, IState } from './types';

const initialState = {
	emailBoxes: {},
	emailBox: {},
	connectedEmailBox: {},
	folders: {},
	folder: {},
	letters: {},
	chainLetters: {},
	letter: {},
	loadingEmailBoxes: false,
	loadingEmailBox: false,
	loadingConnectEmailBox: false,
	loadingUpdateEmailCredentials: false,
	loadingUpdateEmailBox: false,
	loadingRemoveEmailBox: false,
	loadingFolders: false,
	loadingLetters: false,
	loadingChainLetters: false,
	loadingLetter: false,
	loadingCreatingLetter: false,
	loadingDeletingLetter: false,
	loadingIsReadStatus: false,
	loadingMoveLetter: false,
	errorLoadingEmailBoxes: null,
	errorLoadingEmailBox: null,
	errorLoadingConnectEmailBox: null,
	errorLoadingUpdateEmailCredentials: null,
	errorLoadingUpdateEmailBox: null,
	errorLoadingRemoveEmailBox: null,
	errorLoadingFolders: null,
	errorLoadingLetters: null,
	errorLoadingChainLetters: null,
	errorLoadingLetter: null,
	errorLoadingCreatingLetter: null,
	errorLoadingDeletingLetter: null,
	errorLoadingIsReadStatus: null,
	errorLoadingMoveLetter: null,
	openLetter: false,
	isCreateNewLetter: false,
	createNewLetterMode: 'window',
	filters: {
		page: 1,
		list: 50,
		is_read: [],
		date: [],
		certainDateOrPeriod_date: [],
		time_label_date: [],
		openCalendar: false,
	},
	selectedLetters: [],
	emailTableHeaderType: 'default',
} as IState;

const emailReducer = createSlice({
	name: 'emailReducer',
	initialState,
	reducers: {
		setEmailBoxes: (state, action: PayloadAction<IEmailBoxes>) => {
			state.emailBoxes = action.payload;
		},
		setEmailBox: (state, action: PayloadAction<IEmailBox>) => {
			state.emailBox = action.payload;
		},
		setConnectedEmailBox: (state, action: PayloadAction<IEmailBox>) => {
			state.connectedEmailBox = action.payload;
		},
		setFolders: (state, action: PayloadAction<IFolders>) => {
			state.folders = action.payload;
		},
		setFolder: (state, action: PayloadAction<IFolder>) => {
			state.folder = action.payload;
		},
		setLetters: (state, action: PayloadAction<ILetters>) => {
			state.letters = action.payload;
		},
		setChainLetters: (state, action: PayloadAction<ILetters>) => {
			state.chainLetters = action.payload;
		},
		setLetter: (state, action: PayloadAction<ILetter>) => {
			state.letter = action.payload;
		},
		setOpenLetter: (state, action: PayloadAction<boolean>) => {
			state.openLetter = action.payload;
		},
		setIsCreateNewLetter: (state, action: PayloadAction<boolean>) => {
			state.isCreateNewLetter = action.payload;
		},
		setCreateNewLetterMode: (state, action: PayloadAction<createNewLetterModeType>) => {
			state.createNewLetterMode = action.payload;
		},
		setFilters: (state, action: PayloadAction<IEmailFilters>) => {
			state.filters = action.payload;
		},
		setSelectedLetters: (state, action: PayloadAction<number[]>) => {
			state.selectedLetters = action.payload;
		},
		setEmailTableHeaderType: (state, action: PayloadAction<headerTypes>) => {
			state.emailTableHeaderType = action.payload;
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
		[setupEmailBox.fulfilled.type]: (state, action: PayloadAction<IEmailBox>) => {
			state.loadingUpdateEmailBox = false;
			state.errorLoadingUpdateEmailBox = null;
			state.emailBoxes.data = state.emailBoxes.data.map((emailBox) => (emailBox.id === action.payload.id ? action.payload : emailBox));
		},
		[setupEmailBox.pending.type]: (state) => {
			state.loadingUpdateEmailBox = true;
			state.errorLoadingUpdateEmailBox = null;
		},
		[setupEmailBox.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdateEmailBox = false;
			state.errorLoadingUpdateEmailBox = action.payload;
		},
		[updateEmailBoxCredentials.fulfilled.type]: (state, action: PayloadAction<IEmailBox>) => {
			state.loadingUpdateEmailCredentials = false;
			state.errorLoadingUpdateEmailCredentials = null;
			state.emailBox = action.payload;
			state.emailBoxes.data = state.emailBoxes.data.map((emailBox) => (emailBox.id === action.payload.id ? action.payload : emailBox));
		},
		[updateEmailBoxCredentials.pending.type]: (state) => {
			state.loadingUpdateEmailCredentials = true;
			state.errorLoadingUpdateEmailCredentials = null;
		},
		[updateEmailBoxCredentials.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingUpdateEmailCredentials = false;
			state.errorLoadingUpdateEmailCredentials = action.payload;
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
		[getEmailChainLetters.fulfilled.type]: (state, action: PayloadAction<ILetters>) => {
			state.loadingChainLetters = false;
			state.errorLoadingChainLetters = null;
			state.chainLetters = action.payload;
		},
		[getEmailChainLetters.pending.type]: (state) => {
			state.loadingChainLetters = true;
			state.errorLoadingChainLetters = null;
		},
		[getEmailChainLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingChainLetters = false;
			state.errorLoadingChainLetters = action.payload;
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
		[readEmailLetters.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = null;
			state.letters.data = state.letters.data.map((letter) => (action.payload.includes(letter.id) ? { ...letter, is_read: true } : letter));
		},
		[readEmailLetters.pending.type]: (state) => {
			state.loadingIsReadStatus = true;
			state.errorLoadingIsReadStatus = null;
		},
		[readEmailLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = action.payload;
		},
		[unreadEmailLetters.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = null;
			state.letters.data = state.letters.data.map((letter) => (action.payload.includes(letter.id) ? { ...letter, is_read: false } : letter));
		},
		[unreadEmailLetters.pending.type]: (state) => {
			state.loadingIsReadStatus = true;
			state.errorLoadingIsReadStatus = null;
		},
		[unreadEmailLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = action.payload;
		},
		[moveLetter.fulfilled.type]: (state, action: PayloadAction<ILetter>) => {
			state.loadingMoveLetter = false;
			state.errorLoadingMoveLetter = null;
			state.letters.data = state.letters.data.filter((letter) => letter?.id !== action.payload.id);
		},
		[moveLetter.pending.type]: (state) => {
			state.loadingMoveLetter = true;
			state.errorLoadingMoveLetter = null;
		},
		[moveLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingMoveLetter = false;
			state.errorLoadingMoveLetter = action.payload;
		},
		[moveLetters.fulfilled.type]: (state, action: PayloadAction<number[]>) => {
			state.loadingMoveLetter = false;
			state.errorLoadingMoveLetter = null;
			state.letters.data = state.letters.data.filter((letter) => !action.payload.includes(letter.id));
		},
		[moveLetters.pending.type]: (state) => {
			state.loadingMoveLetter = true;
			state.errorLoadingMoveLetter = null;
		},
		[moveLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingMoveLetter = false;
			state.errorLoadingMoveLetter = action.payload;
		},
	},
});

export const {
	setEmailBoxes,
	setEmailBox,
	setConnectedEmailBox,
	setFolders,
	setFolder,
	setLetters,
	setChainLetters,
	setLetter,
	setOpenLetter,
	setIsCreateNewLetter,
	setCreateNewLetterMode,
	setFilters,
	setSelectedLetters,
	setEmailTableHeaderType,
} = emailReducer.actions;
export default emailReducer.reducer;
