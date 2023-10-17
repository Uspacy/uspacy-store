import { createAsyncThunk } from '@reduxjs/toolkit';
import { uspacySdk } from '@uspacy/sdk';
import { INotify } from '@uspacy/sdk/lib/models/notify';

import { IEditPost, ISendPost } from './types';

export const fetchPosts = createAsyncThunk('postsReducer/fetchPosts', async (data: { page: number; list: number; group_id: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.newsFeedService.getPosts(data.page, data.list, data.group_id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const fetchPostById = createAsyncThunk('postsReducer/fetchPostById', async (data: { id: number }, thunkAPI) => {
	try {
		const res = await uspacySdk.newsFeedService.getPost(data.id);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const createPost = createAsyncThunk('postsReducer/createPost', async (data: ISendPost, { rejectWithValue }) => {
	try {
		const res = await uspacySdk.newsFeedService.createPost(data);
		return res.data;
	} catch (e) {
		return rejectWithValue(e);
	}
});

export const editPost = createAsyncThunk('postsReducer/editedPost', async ({ data, id }: IEditPost, thunkAPI) => {
	try {
		const res = await uspacySdk.newsFeedService.updatePost(id, data);
		return res.data;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});

export const deletePost = createAsyncThunk('postsReducer/deletePost', async ({ id, notify }: { id: string; notify: INotify }, thunkAPI) => {
	try {
		await uspacySdk.newsFeedService.deletePost(id, notify);
		return id;
	} catch (e) {
		return thunkAPI.rejectWithValue(e);
	}
});
