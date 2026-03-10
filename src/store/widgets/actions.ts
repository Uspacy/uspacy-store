import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { ICreateWidgetData } from '@uspacy/sdk/lib/models/messenger';

export const createWidget = createAsyncThunk('messenger/createWidget', async (data: ICreateWidgetData, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.createWidget(data)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const getWidgets = createAsyncThunk(
	'messenger/getWidgets',
	async ({ limit, page }: { limit?: number; page?: number }, { rejectWithValue }) => {
		try {
			return (await uspacySdk.messengerService.getWidgets(limit, page)).data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);

export const deleteWidget = createAsyncThunk('messenger/deleteWidget', async (id: ICreateWidgetData['id'], { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.deleteWidgets(id)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const updateWidget = createAsyncThunk('messenger/updateWidget', async (data: ICreateWidgetData, { rejectWithValue }) => {
	try {
		return (await uspacySdk.messengerService.updateWidget(data)).data;
	} catch (e) {
		return rejectWithValue(e);
	}
});
