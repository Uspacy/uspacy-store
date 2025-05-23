/* eslint-disable camelcase */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IConnectEmailBox } from '@uspacy/sdk/lib/services/EmailService/connect-email-box.dto';
import { ICreateLetterPayload } from '@uspacy/sdk/lib/services/EmailService/create-email.dto';
import { ISignaturePayload } from '@uspacy/sdk/lib/services/EmailService/signature.dto';

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
	async ({ ids, folderId, list_ids, threads }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.removeEmailLetters(ids, threads);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const readEmailLetters = createAsyncThunk(
	'email/readEmailLetters',
	async ({ ids, folderId, list_ids, threads }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.readEmailLetters(ids, folderId, threads);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const unreadEmailLetters = createAsyncThunk(
	'email/unreadEmailLetters',
	async ({ ids, folderId, list_ids, threads }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.unreadEmailLetters(ids, folderId, threads);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const moveLetters = createAsyncThunk(
	'email/moveLetters',
	async ({ ids, folderId, list_ids, threads }: IEmailMassActionsResponse, thunkAPI) => {
		try {
			await uspacySdk.emailService.moveLetters(ids, folderId, threads);
			return { list_ids, folderId };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getIntgrWithCrmSettings = createAsyncThunk('email/getIntgrWithCrmSettings', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getIntgrWithCrmSettings(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const redirectToOauthLink = createAsyncThunk(
	'email/redirectToOauthLink',
	async ({ url, service }: { url: string; service: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.emailService.redirectToOauthLink(url, service);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const receiveToOauthLink = createAsyncThunk(
	'email/receiveToOauthLink',
	async ({ code, service }: { code: string; service: string }, thunkAPI) => {
		try {
			const res = await uspacySdk.emailService.receiveToOauthLink(code, service);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const getEmailSignatures = createAsyncThunk('email/getEmailSignatures', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailSignatures();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createEmailSignature = createAsyncThunk('email/createEmailSignature', async (body: ISignaturePayload, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.createEmailSignature(body);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateEmailSignature = createAsyncThunk(
	'email/updateEmailSignature',
	async ({ id, body }: { id: number; body: Partial<ISignaturePayload> }, thunkAPI) => {
		try {
			const res = await uspacySdk.emailService.updateEmailSignature(id, body);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const removeEmailSignature = createAsyncThunk('email/removeEmailSignature', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.emailService.removeEmailSignature(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
