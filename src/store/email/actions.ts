import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ICreateLetterPayload } from '@uspacy/sdk/lib/services/EmailService/create-email.dto';

import { ILettersParams } from './types';

export const getEmailFolders = createAsyncThunk('email/getEmailFolders', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailFolders();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getEmailLetters = createAsyncThunk('email/getEmailLetters', async ({ id, page, list }: ILettersParams, thunkAPI) => {
	try {
		const res = await uspacySdk.emailService.getEmailLetters(id, page, list);
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
