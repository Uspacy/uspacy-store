import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { EntityType } from '@uspacy/sdk/lib/models/comment';

export const fetchComments = createAsyncThunk(
	'tasks/fetchComments',
	async (
		{
			entityId,
			entityType,
			list,
			childList,
			nextId,
			lastId,
		}: { entityType: EntityType; entityId: number; list?: number; childList?: number; nextId?: number; lastId?: number },
		{ rejectWithValue },
	) => {
		try {
			const res = await uspacySdk.commentsService.getComments(entityType, entityId, list, childList, nextId, lastId);
			return res.data;
		} catch (e) {
			return rejectWithValue(e);
		}
	},
);
