import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFile } from '@uspacy/sdk/lib/models/files';
import { EmotionType, IPost } from '@uspacy/sdk/lib/models/newsfeed';
import { IResponseWithPagination } from '@uspacy/sdk/lib/models/response';

import { createPost, deletePost, editPost, fetchPostById, fetchPosts } from './actions';
import { IState } from './types';

const initialState = {
	loadPosts: {
		data: [],
	},
	allPosts: [],
	post: {},
	newPost: {
		placeholderInputTitle: '',
		labelInputTitle: '',
		isShowAddPost: false,
		valuePlaceholderEditor: '',
		titlePost: '',
		whichMethod: 'delete',
		postId: '',
		recipients: {
			include: {
				usersIds: [],
				departmentsIds: [],
			},
			exclude: {
				departmentsIds: [],
				usersIds: [],
			},
		},
		authorMood: '',
		fileIds: [],
		group_id: null,
		notify: {
			users: [],
			groups: [],
			departments: [],
		},
	},
	editPostItem: {
		id: '',
		files: [],
		fileIds: [],
		editStatus: false,
		author_mood: '',
		date: 0,
		recipients: {
			include: {
				users: [],
				departments: [],
			},
			exclude: {
				departments: [],
				users: [],
			},
		},
		authorId: '',
		message: '',
		title: '',
		notify: {
			users: [],
			groups: [],
			departments: [],
		},
	},
	isNewPostCreate: false,
	loadPost: true,
	loadingPosts: false,
	loadingCreatePost: false,
	loadingEditPost: false,
	loadingDeletePost: false,
	errorLoadingPosts: null,
	errorLoadingCreatedPost: null,
	errorEditingPost: null,
	errorDeletingPost: null,
} as IState;

export const postsReducer = createSlice({
	name: 'postsReducer',
	initialState,
	reducers: {
		changeTitle: (state, action: PayloadAction<string>) => {
			state.newPost.titlePost = action.payload;
		},
		showPost: (state, action: PayloadAction<{ placeholder: string; labelInput: string; isShowPost: boolean }>) => {
			state.newPost.placeholderInputTitle = action.payload.placeholder;
			state.newPost.labelInputTitle = action.payload.labelInput;
			state.newPost.isShowAddPost = action.payload.isShowPost;
		},
		defaultPost: (state, action: PayloadAction<{ placeholder: string; labelInput: string }>) => {
			state.newPost.placeholderInputTitle = action.payload.placeholder;
			state.newPost.labelInputTitle = action.payload.labelInput;
			state.newPost.valuePlaceholderEditor = '';
			state.newPost.fileIds = [];
			state.newPost.isShowAddPost = false;
			state.newPost.titlePost = '';
			state.newPost.whichMethod = 'delete';
			state.newPost.postId = '';
			state.newPost.authorMood = '';
			state.newPost.recipients = {
				include: {
					usersIds: [],
					departmentsIds: [],
				},
				exclude: {
					departmentsIds: [],
					usersIds: [],
				},
			};
		},
		changeMainContent: (state, action: PayloadAction<string>) => {
			state.newPost.valuePlaceholderEditor = action.payload;
		},
		changeMood: (state, action: PayloadAction<EmotionType | ''>) => {
			state.newPost.authorMood = action.payload;
		},
		changeNewPostStatus: (state, action: PayloadAction<boolean>) => {
			state.isNewPostCreate = action.payload;
		},
		deletePostFromPosts: (state, action: PayloadAction<string>) => {
			state.allPosts = state.allPosts.filter((it) => it.id !== action.payload);
		},
		addToAllPosts: (state, action: PayloadAction<IPost[]>) => {
			state.allPosts = action.payload;
		},
		changeRecipients: (state, action: PayloadAction<string[]>) => {
			state.newPost.recipients.include.usersIds = action.payload;
		},
		changeFileIds: (state, action: PayloadAction<number[]>) => {
			state.newPost.fileIds = action.payload;
		},
		changeTitleEditPost: (state, action: PayloadAction<string>) => {
			state.editPostItem.title = action.payload;
		},
		changeMoodEditPost: (state, action: PayloadAction<EmotionType | ''>) => {
			state.editPostItem.author_mood = action.payload;
		},
		changeMessageEditPost: (state, action: PayloadAction<string>) => {
			state.editPostItem.message = action.payload;
		},
		changeFileIdsEditPost: (state, action: PayloadAction<number[]>) => {
			state.editPostItem.fileIds = action.payload;
		},
		changeRecipientsEditPost: (state, action: PayloadAction<string[]>) => {
			state.editPostItem.recipients.include.usersIds = action.payload;
		},
		fillEditPost: (state, action: PayloadAction<IPost>) => {
			state.editPostItem.editStatus = true;
			state.editPostItem.id = action.payload.id;
			state.editPostItem.title = action.payload.title;
			state.editPostItem.message = action.payload.message;
			state.editPostItem.author_mood = action.payload.author_mood;
			state.editPostItem.authorId = action.payload.authorId;
			state.editPostItem.recipients = action.payload.recipients
				? action.payload.recipients
				: {
						include: {
							usersIds: [],
							departmentsIds: [],
						},
						exclude: {
							departmentsIds: [],
							usersIds: [],
						},
				  };
			state.editPostItem.files = action.payload?.files ? action.payload?.files : [];
		},
		cancelEditPost: (state) => {
			state.editPostItem.id = '';
			state.editPostItem.files = [];
			state.editPostItem.fileIds = [];
			state.editPostItem.editStatus = false;
			state.editPostItem.author_mood = '';
			state.editPostItem.date = 0;
			state.editPostItem.recipients = {
				include: {
					usersIds: [],
					departmentsIds: [],
				},
				exclude: {
					departmentsIds: [],
					usersIds: [],
				},
			};
			state.editPostItem.authorId = '';
			state.editPostItem.message = '';
			state.editPostItem.title = '';
		},
		deleteFileFromPost: (state, action: PayloadAction<{ postId: string; deleteFileId: number }>) => {
			state.allPosts = state.allPosts.map((post) =>
				post.id === action.payload.postId ? { ...post, files: post.files.filter((file) => file.id !== action.payload.deleteFileId) } : post,
			);
			state.editPostItem = { ...state.editPostItem, files: state.editPostItem.files.filter((file) => file.id !== action.payload.deleteFileId) };
		},
		addFileToPost: (state, action: PayloadAction<{ postId: string; file: IFile[] }>) => {
			state.allPosts = state.allPosts.map((post) =>
				post.id === action.payload.postId
					? { ...post, files: post?.files?.length > 0 ? [...post.files, ...action.payload.file] : [...action.payload.file] }
					: post,
			);
		},
		clearPosts: (state) => {
			state.loadPosts.data = [];
			state.allPosts = [];
			state.loadingPosts = true;
		},
		groupIdForPost: (state, action) => {
			state.newPost.group_id = action.payload;
		},
	},
	extraReducers: {
		[fetchPosts.fulfilled.type]: (state, action: PayloadAction<IResponseWithPagination<IPost>>) => {
			state.loadingPosts = false;
			state.errorLoadingPosts = null;
			state.loadPosts = action?.payload;
		},
		[fetchPosts.pending.type]: (state) => {
			state.loadingPosts = true;
		},
		[fetchPosts.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingPosts = false;
			state.errorLoadingPosts = action?.payload;
		},
		[fetchPostById.fulfilled.type]: (state, action: PayloadAction<{ data: IPost }>) => {
			state.loadPost = false;
			state.errorLoadingPosts = null;
			state.post = action?.payload.data;
		},
		[fetchPostById.pending.type]: (state) => {
			state.loadPost = true;
		},
		[fetchPostById.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadPost = false;
			state.errorLoadingPosts = action?.payload;
		},
		[createPost.fulfilled.type]: (state, action: PayloadAction<{ data: IPost }>) => {
			state.isNewPostCreate = true;
			state.loadPosts.data = [action.payload.data];
			state.loadingCreatePost = false;
			state.errorLoadingCreatedPost = null;
			state.newPost.valuePlaceholderEditor = '';
			state.newPost.isShowAddPost = false;
			state.newPost.titlePost = '';
			state.newPost.whichMethod = 'delete';
			state.newPost.postId = '';
			state.newPost.authorMood = '';
			state.newPost.recipients = {};
		},
		[createPost.pending.type]: (state) => {
			state.loadingCreatePost = true;
			state.isNewPostCreate = false;
		},
		[createPost.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingCreatePost = false;
			state.isNewPostCreate = false;
			state.errorLoadingCreatedPost = action?.payload;
		},
		[editPost.fulfilled.type]: (state, action: PayloadAction<{ data: IPost }>) => {
			state.loadingEditPost = false;
			state.errorEditingPost = null;
			state.allPosts = state.allPosts.map((it) => (it.id === action.payload.data.id ? { ...action.payload.data, files: it.files } : it));
		},
		[editPost.pending.type]: (state) => {
			state.loadingEditPost = true;
		},
		[editPost.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingEditPost = false;
			state.errorEditingPost = action?.payload;
		},
		[deletePost.fulfilled.type]: (state, action: PayloadAction<string | number>) => {
			state.loadingDeletePost = false;
			state.errorDeletingPost = null;
			state.allPosts = state.allPosts.filter((post) => +post.id !== +action?.payload);
		},
		[deletePost.pending.type]: (state) => {
			state.loadingDeletePost = true;
		},
		[deletePost.rejected.type]: (state, action: PayloadAction<IErrorsAxiosResponse>) => {
			state.loadingDeletePost = false;
			state.errorDeletingPost = action?.payload;
		},
	},
});

export default postsReducer.reducer;
