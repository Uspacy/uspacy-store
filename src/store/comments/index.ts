import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IComment } from '@uspacy/sdk/lib/models/comment';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';

import { createComment, deleteComment, editComment, fetchCommentById, fetchComments, fetchCommentsByArray } from './actions';
import { IComments, IState } from './types';

const initialState = {
	commentsList: [],
	subCommentsList: [],
	comments: {},
	loadingComments: false,
	errorLoadingComments: null,
	comment: {},
	allComments: {},
	loadingCreatedComment: false,
	loadingEditComment: false,
	loadingDeleteComment: false,
	errorCreatingComment: null,
	errorEditingComment: null,
	errorDeletingComment: null,
} as unknown as IState;

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
		[fetchCommentById.fulfilled.type]: (state, action: PayloadAction<IComment>) => {
			state.loadingComments = false;
			state.errorLoadingComments = null;
			state.comment = action?.payload;
		},
		[fetchCommentById.pending.type]: (state) => {
			state.loadingComments = true;
		},
		[fetchCommentById.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingComments = false;
			state.errorLoadingComments = action?.payload;
		},
		[fetchCommentsByArray.fulfilled.type]: (state, action: PayloadAction<IComments>) => {
			state.loadingComments = false;
			state.errorLoadingComments = null;
			state.comments = action?.payload;
		},
		[fetchCommentsByArray.pending.type]: (state) => {
			state.loadingComments = true;
		},
		[fetchCommentsByArray.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingComments = false;
			state.errorLoadingComments = action?.payload;
		},
		[createComment.fulfilled.type]: (state, action: PayloadAction<IComment>) => {
			state.loadingCreatedComment = true;
			state.errorCreatingComment = null;
			state?.comments?.data?.push(action?.payload);
		},
		[createComment.pending.type]: (state) => {
			state.loadingCreatedComment = true;
		},
		[createComment.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatedComment = false;
			state.errorCreatingComment = action?.payload;
		},

		[editComment.fulfilled.type]: (state, action: PayloadAction<IComment>) => {
			const index = state?.comments?.data?.findIndex((comment) => comment?.id === action?.payload?.id);
			state.loadingEditComment = true;
			state.errorEditingComment = null;
			state.comments.data[index] = {
				...state.comments.data[index],
				...action.payload,
			};
		},
		[editComment.pending.type]: (state) => {
			state.loadingEditComment = true;
		},
		[editComment.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEditComment = false;
			state.errorEditingComment = action?.payload;
		},

		[deleteComment.fulfilled.type]: (state, action: PayloadAction<IComment>) => {
			state.loadingDeleteComment = true;
			state.errorDeletingComment = null;
			state?.comments?.data?.filter((comment) => comment?.id !== action?.payload?.id);
		},
		[deleteComment.pending.type]: (state) => {
			state.loadingDeleteComment = true;
		},
		[deleteComment.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeleteComment = false;
			state.errorDeletingComment = action?.payload;
		},
	},
});

export const { setCommentsList, setSubCommentsList, clearComments } = commentsReducer.actions;
export default commentsReducer.reducer;
