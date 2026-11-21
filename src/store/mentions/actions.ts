import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { EntityMentionType } from '@uspacy/sdk/lib/models/mentions';
import { IMentionCreateDto, IMentionUpdateDto } from '@uspacy/sdk/lib/services/MentionsService/dto/mention.dto';

export const fetchMentions = createAsyncThunk('mentions/fetchMentions', async (_: void, thunkAPI) => {
	try {
		const res = await uspacySdk.mentionsService.getMentions();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchMentionsQuota = createAsyncThunk('mentions/fetchMentionsQuota', async (_: void, thunkAPI) => {
	try {
		const res = await uspacySdk.mentionsService.getQuota();
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createMention = createAsyncThunk('mentions/createMention', async (body: IMentionCreateDto, thunkAPI) => {
	try {
		const res = await uspacySdk.mentionsService.createMention(body);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const updateMention = createAsyncThunk('mentions/updateMention', async ({ id, body }: { id: string; body: IMentionUpdateDto }, thunkAPI) => {
	try {
		const res = await uspacySdk.mentionsService.updateMention(id, body);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deleteMention = createAsyncThunk('mentions/deleteMention', async (id: string, thunkAPI) => {
	try {
		await uspacySdk.mentionsService.deleteMention(id);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const setEntityMention = createAsyncThunk(
	'mentions/setEntityMention',
	async ({ type, entityId, name }: { type: EntityMentionType; entityId: number; name: string | null }, thunkAPI) => {
		try {
			const res = await uspacySdk.mentionsService.setEntityMention(type, entityId, name);
			return { type, entityId, mention: res.data };
		} catch (e) {
			return thunkAPI.rejectWithValue(e);
		}
	},
);
