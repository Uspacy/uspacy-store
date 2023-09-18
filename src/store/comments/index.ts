import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComment } from '@uspacy/sdk/lib/models/comment';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { fetchComments } from './actions';
import { IComments, IState } from './types';

const initialState = {
	commentsList: [],
	subCommentsList: [],
	comments: {},
	loadingComments: false,
	errorLoadingComments: null,
} as IState;

const commentsReducer = createSlice({
	name: 'commentsReducer',
	initialState,
	reducers: {
		setCommentsList: (state, action: PayloadAction<IComment[]>) => {
			state.commentsList = action.payload;
		},
		setSubCommentsList: (state, action: PayloadAction<IComment[]>) => {
			state.subCommentsList = action.payload;
		},
		clearComments: (state) => {
			state.comments = {} as IComments;
		},
	},
	extraReducers: {
		[fetchComments.fulfilled.type]: (state, action: PayloadAction<IComments>) => {
			state.loadingComments = false;
			state.errorLoadingComments = null;
			state.comments.data = action.payload.data;
		},
		[fetchComments.pending.type]: (state) => {
			state.loadingComments = true;
			state.errorLoadingComments = null;
		},
		[fetchComments.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingComments = false;
			state.errorLoadingComments = action.payload;
		},
	},
});

export const { setCommentsList, setSubCommentsList, clearComments } = commentsReducer.actions;
export default commentsReducer.reducer;
