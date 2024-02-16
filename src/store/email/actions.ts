/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IConnectEmailBox } from '@uspacy/sdk/lib/services/EmailService/connect-email-box.dto';
import { ICreateLetterPayload } from '@uspacy/sdk/lib/services/EmailService/create-email.dto';

import { IEmailMassActionsResponse, ILettersParams, IUpdateEmailBoxPayload } from './types';

export const getEmailsBoxes = createAsyncThunk('email/getEmailsBoxes', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailsBoxes();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailBox = createAsyncThunk('email/getEmailBox', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailBox(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const connectEmailBox = createAsyncThunk('email/connectEmailBox', async (data: IConnectEmailBox, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.connectEmailBox(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const setupEmailBox = createAsyncThunk('email/setupEmailBox', async ({ id, data }: IUpdateEmailBoxPayload, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.setupEmailBox(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateEmailBoxCredentials = createAsyncThunk(
	'email/updateEmailBoxCredentials',
	async ({ id, data }: IUpdateEmailBoxPayload, thunkAPI) => {
		try {
			const res = await uspacySdk.emailService.updateEmailBoxCredentials(id, data);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const updateEmailBox = createAsyncThunk('email/updateEmailBox', async ({ id, data }: IUpdateEmailBoxPayload, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.updateEmailBox(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const removeEmailBox = createAsyncThunk('email/removeEmailBox', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.emailService.removeEmailBox(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailFolders = createAsyncThunk('email/getEmailFolders', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailFolders();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailLetters = createAsyncThunk('email/getEmailLetters', async ({ id, params, signal }: ILettersParams, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailLetters(id, params, signal);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailChainLetters = createAsyncThunk('email/getEmailChainLetters', async ({ id, params }: ILettersParams, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailChainLetters(id, params);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailLetter = createAsyncThunk('email/getEmailLetter', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailLetter(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createEmailLetter = createAsyncThunk(
	'email/createEmailLetter',
	async ({ data, id }: { data: ICreateLetterPayload; id: number }, thunkAPI) => {
		try {
			const res = await uspacySdk.emailService.createEmailLetter(data, id);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const resendEmailLetter = createAsyncThunk('email/resendEmailLetter', async ({ id }: { id: number }, thunkAPI) => {
	try {
		await uspacySdk.emailService.resendEmailLetter(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const removeEmailLetter = createAsyncThunk('email/removeEmailLetter', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.emailService.removeEmailLetter(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const removeEmailLetters = createAsyncThunk(
	'email/removeEmailLetters',
	async ({ ids, folderId, list_ids }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.removeEmailLetters(ids);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const readEmailLetters = createAsyncThunk(
	'email/readEmailLetters',
	async ({ ids, folderId, chain_ids, list_ids }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.readEmailLetters(ids, chain_ids);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const unreadEmailLetters = createAsyncThunk(
	'email/unreadEmailLetters',
	async ({ ids, folderId, chain_ids, list_ids }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.unreadEmailLetters(ids, chain_ids);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const moveLetter = createAsyncThunk('email/moveLetter', async ({ letterId, folderId }: IEmailMassActionsResponse, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.moveLetter(letterId, folderId);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const moveLetters = createAsyncThunk(
	'email/moveLetters',
	async ({ ids, folderId, chain_ids, list_ids }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.moveLetters(ids, folderId, chain_ids);
			return list_ids;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
