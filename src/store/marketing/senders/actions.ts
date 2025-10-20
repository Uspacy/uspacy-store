import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ISender } from '@uspacy/sdk/lib/models/newsletters-sender';

export const getSenders = createAsyncThunk('marketing/senders/getSenders', async (_, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getSenders();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const getSender = createAsyncThunk('marketing/senders/getSender', async (id: number, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.getSender(id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createSender = createAsyncThunk('marketing/senders/createSender', async (data: Partial<ISender>, thunkAPI) => {
	try {
		const res = await uspacySdk.marketingService.createSender(data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateSender = createAsyncThunk(
	'marketing/senders/updateSender',
	async ({ id, data }: { id: number; data: Partial<ISender> }, thunkAPI) => {
		try {
			const res = await uspacySdk.marketingService.updateSender(id, data);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);

export const deleteSender = createAsyncThunk('marketing/senders/deleteSender', async (id: number, thunkAPI) => {
	try {
		return await uspacySdk.marketingService.deleteSender(id);
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
