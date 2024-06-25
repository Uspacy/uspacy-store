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
	moveLetters,
	readEmailLetters,
	receiveToOauthLink,
	redirectToOauthLink,
	removeEmailBox,
	removeEmailLetter,
	removeEmailLetters,
	resendEmailLetter,
	setupEmailBox,
	unreadEmailLetters,
	updateEmailBox,
	updateEmailBoxCredentials,
} from './actions';
import { createNewLetterModeType, headerTypes, IEmailMassActionsResponse, IState } from './types';

const initialState = {
	emailBoxes: {},
	emailBox: {},
	connectedEmailBox: {},
	folders: {},
	folder: {},
	letters: {},
	chainLetters: {},
	letter: {},
	createdLetter: {},
	removedLetterIds: null,
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
	loadingResendLetter: false,
	loadingDeletingLetter: false,
	loadingDeletingLetters: false,
	loadingIsReadStatus: false,
	loadingMoveLetter: false,
	loadingOAuthRedirect: false,
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
	errorLoadingResendLetter: null,
	errorLoadingDeletingLetter: null,
	errorLoadingDeletingLetters: null,
	errorLoadingIsReadStatus: null,
	errorLoadingMoveLetter: null,
	errorLoadingOAuthRedirect: null,
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
		q: '',
	},
	selectedLetters: [],
	emailTableHeaderType: 'default',
	oAuthUrl: '',
	oAuthCode: '',
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
		setCreatedLetter: (state, action: PayloadAction<ILetter>) => {
			state.createdLetter = action.payload;
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
		setSelectedLetters: (state, action: PayloadAction<ILetter[]>) => {
			state.selectedLetters = action.payload;
		},
		setEmailTableHeaderType: (state, action: PayloadAction<headerTypes>) => {
			state.emailTableHeaderType = action.payload;
		},
		setOAuthUrl: (state, action: PayloadAction<string>) => {
			state.oAuthUrl = action.payload;
		},
		setOAuthCode: (state, action: PayloadAction<string>) => {
			state.oAuthCode = action.payload;
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
			state.emailBoxes.data = [...state.emailBoxes.data, action.payload];
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
		[redirectToOauthLink.fulfilled.type]: (state, action: PayloadAction<{ url: string }>) => {
			state.loadingOAuthRedirect = false;
			state.errorLoadingOAuthRedirect = null;
			state.oAuthUrl = action.payload.url;
		},
		[redirectToOauthLink.pending.type]: (state) => {
			state.loadingOAuthRedirect = true;
			state.errorLoadingOAuthRedirect = null;
		},
		[redirectToOauthLink.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingOAuthRedirect = false;
			state.errorLoadingOAuthRedirect = action.payload;
		},
		[receiveToOauthLink.fulfilled.type]: (state, action: PayloadAction<IEmailBox>) => {
			state.loadingConnectEmailBox = false;
			state.errorLoadingConnectEmailBox = null;
			state.connectedEmailBox = action.payload;
			state.emailBoxes.data = [...state.emailBoxes.data, action.payload];
		},
		[receiveToOauthLink.pending.type]: (state) => {
			state.loadingConnectEmailBox = true;
			state.errorLoadingConnectEmailBox = null;
		},
		[receiveToOauthLink.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingConnectEmailBox = false;
			state.errorLoadingConnectEmailBox = action.payload;
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
			state.createdLetter = action.payload;
		},
		[createEmailLetter.pending.type]: (state) => {
			state.loadingCreatingLetter = true;
			state.errorLoadingCreatingLetter = null;
		},
		[createEmailLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatingLetter = false;
			state.errorLoadingCreatingLetter = action.payload;
		},
		[resendEmailLetter.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingResendLetter = false;
			state.errorLoadingResendLetter = null;
			state.letters.data = state.letters.data.map((letter) => {
				if (letter?.id === action.payload) return { ...letter, status: 'pending' };
				return letter;
			});
		},
		[resendEmailLetter.pending.type]: (state) => {
			state.loadingResendLetter = true;
			state.errorLoadingResendLetter = null;
		},
		[resendEmailLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingResendLetter = false;
			state.errorLoadingResendLetter = action.payload;
		},
		[removeEmailLetter.fulfilled.type]: (state, action: PayloadAction<number>) => {
			state.loadingDeletingLetter = false;
			state.errorLoadingDeletingLetter = null;
			state.letters.data = state.letters.data.filter((letter) => letter.id !== action.payload);
			state.removedLetterIds = [action.payload];
		},
		[removeEmailLetter.pending.type]: (state) => {
			state.loadingDeletingLetter = true;
			state.errorLoadingDeletingLetter = null;
		},
		[removeEmailLetter.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingLetter = false;
			state.errorLoadingDeletingLetter = action.payload;
		},
		[removeEmailLetters.fulfilled.type]: (state, action: PayloadAction<IEmailMassActionsResponse>) => {
			state.loadingDeletingLetters = false;
			state.errorLoadingDeletingLetters = null;
			state.folders.data = state.folders.data.map((folder) => {
				if (folder?.id === action.payload.folderId) {
					const readIds = state.letters.data.filter((letter) => action.payload.list_ids.includes(letter.id) && !letter.is_read).length;
					return { ...folder, unread_message_count: folder.unread_message_count - readIds };
				}
				return folder;
			});
			state.letters.data = state.letters.data.filter((letter) => !action.payload.list_ids.includes(letter.id));
			state.removedLetterIds = action.payload.ids;
		},
		[removeEmailLetters.pending.type]: (state) => {
			state.loadingDeletingLetters = true;
			state.errorLoadingDeletingLetters = null;
		},
		[removeEmailLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletingLetters = false;
			state.errorLoadingDeletingLetters = action.payload;
		},
		[readEmailLetters.fulfilled.type]: (state, action: PayloadAction<IEmailMassActionsResponse>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = null;
			state.folders.data = state.folders.data.map((folder) => {
				if (folder?.id === action.payload.folderId) {
					const readIds = state.letters.data.filter((letter) => action.payload.list_ids.includes(letter.id) && !letter.is_read).length;
					return { ...folder, unread_message_count: folder.unread_message_count - readIds };
				}
				return folder;
			});
			state.letters.data = state.letters.data.map((letter) => {
				if (action.payload.list_ids.includes(letter.id)) return { ...letter, is_read: true };
				return letter;
			});
			if (state.letter?.id && !state.letter.is_read) {
				state.letter.is_read = true;
			}
		},
		[readEmailLetters.pending.type]: (state) => {
			state.loadingIsReadStatus = true;
			state.errorLoadingIsReadStatus = null;
		},
		[readEmailLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = action.payload;
		},
		[unreadEmailLetters.fulfilled.type]: (state, action: PayloadAction<IEmailMassActionsResponse>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = null;
			state.folders.data = state.folders.data.map((folder) => {
				if (folder?.id === action.payload.folderId) {
					const unreadIds = state.letters.data.filter((letter) => action.payload.list_ids.includes(letter.id) && letter.is_read).length;
					return { ...folder, unread_message_count: folder.unread_message_count + unreadIds };
				}
				return folder;
			});
			state.letters.data = state.letters.data.map((letter) => {
				if (action.payload.list_ids.includes(letter.id)) return { ...letter, is_read: false };
				return letter;
			});
			if (state.letter?.id && state.letter.is_read) {
				state.letter.is_read = false;
			}
		},
		[unreadEmailLetters.pending.type]: (state) => {
			state.loadingIsReadStatus = true;
			state.errorLoadingIsReadStatus = null;
		},
		[unreadEmailLetters.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingIsReadStatus = false;
			state.errorLoadingIsReadStatus = action.payload;
		},
		[moveLetters.fulfilled.type]: (state, action: PayloadAction<IEmailMassActionsResponse>) => {
			state.loadingMoveLetter = false;
			state.errorLoadingMoveLetter = null;
			state.folders.data = state.folders.data.map((folder) => {
				if (folder?.id === action.payload.folderId) {
					const readIds = state.letters.data.filter((letter) => action.payload.list_ids.includes(letter.id) && !letter.is_read).length;
					return { ...folder, unread_message_count: folder.unread_message_count - readIds };
				}
				return folder;
			});
			state.letters.data = state.letters.data.filter((letter) => !action.payload.list_ids.includes(letter.id));
			state.removedLetterIds = action.payload.ids;
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
	setCreatedLetter,
	setOpenLetter,
	setIsCreateNewLetter,
	setCreateNewLetterMode,
	setFilters,
	setSelectedLetters,
	setEmailTableHeaderType,
	setOAuthUrl,
	setOAuthCode,
} = emailReducer.actions;
export default emailReducer.reducer;
