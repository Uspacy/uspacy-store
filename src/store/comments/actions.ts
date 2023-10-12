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

export const fetchCommentsByArray = createAsyncThunk(
	'newsfeed/fetchCommentsByArray',
	async (
		data: { entityIds: number[]; entity_type: 'post' | 'comment'; list?: number; childList?: number; nextId?: number; lastId?: number },
		thunkAPI,
	) => {
		try {
			const res = await uspacySdk.commentsService.getCommentsByEntityIds(
				data.entityIds,
				data.entity_type,
				data.list,
				data.childList,
				data.nextId,
				data.lastId,
			);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const fetchCommentById = createAsyncThunk(
	'newsfeed/fetchCommentById',
	async (
		data: { entityId: number; entity_type: 'post' | 'comment'; list?: number; childList?: number; nextId?: number; lastId?: number },
		thunkAPI,
	) => {
		try {
			const res = await uspacySdk.commentsService.getCommentByEntityId(
				data.entityId,
				data.entity_type,
				data.list,
				data.childList,
				data.nextId,
				data.lastId,
			);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const createComment = createAsyncThunk(
	'newsfeed/createComment',
	async (data: { entityType: string; entityId: number; message?: string }, { rejectWithValue }) => {
		try {
			const res = await uspacySdk.commentsService.createComment(data.entityType, data.entityId, data.message);
			return res.data;
		} catch (e) {
			return rejectWithValue('Failure');
		}
	},
);

export const editComment = createAsyncThunk(
	'newsfeed/editeComment',
	async ({ data, commentId }: { data: { message: string; entityType?: string; entityId?: number }; commentId: number }, thunkAPI) => {
		try {
			const res = await uspacySdk.commentsService.updateComment(commentId, data.message, data.entityType, data.entityId);
			return res.data;
		} catch (e) {
			return thunkAPI.rejectWithValue('Failure');
		}
	},
);

export const deleteComment = createAsyncThunk('newsfeed/deleteComment', async (id: number, thunkAPI) => {
	try {
		return uspacySdk.commentsService.deleteComment(id);
	} catch (e) {
		return thunkAPI.rejectWithValue('Failure');
	}
});
