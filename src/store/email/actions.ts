import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { IConnectEmailBox, IUpdateEmailBox } from '@uspacy/sdk/lib/services/EmailService/connect-email-box.dto';
import { ICreateLetterPayload } from '@uspacy/sdk/lib/services/EmailService/create-email.dto';

import { ILettersParams } from './types';

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

export const updateEmailBox = createAsyncThunk('email/updateEmailBox', async ({ id, data }: { id: number; data: IUpdateEmailBox }, thunkAPI) => {
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

export const getEmailLetters = createAsyncThunk('email/getEmailLetters', async ({ id, params }: ILettersParams, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailLetters(id, params);
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

export const removeEmailLetter = createAsyncThunk('email/removeEmailLetter', async (id: number, thunkAPI) => {
	try {
		await uspacySdk.emailService.removeEmailLetter(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
