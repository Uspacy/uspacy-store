import { IErrorsAxiosResponse } from '@uspacy/sdk/lib/models/errors';
import { IFile } from '@uspacy/sdk/lib/models/files';
import { EmotionType } from '@uspacy/sdk/lib/models/newsfeed';
import { INotify } from '@uspacy/sdk/lib/models/notify';
import { IResponseWithPagination } from '@uspacy/sdk/lib/models/response';
import { RecipientsPost } from '@uspacy/sdk/lib/services/NewsFeedService/dto/cteate-update-posts.dto';

export interface IPost {
	id?: string;
	title?: string;
	message?: string;
	authorId?: string;
	files?: IFile[];
	date?: number;
	author_mood?: EmotionType;
	comments?: IComment[];
	recipients?: RecipientsPost;
	reactions?: {
		reaction: number;
		amount: number;
		entityId: number;
	}[];
}

export interface ISendPost {
	title: string;
	message: string;
	file_ids?: number[];
	author_mood: EmotionType | '';
	recipients: RecipientsPost;
	group_id?: number;
	notify?: INotify;
}

export interface IEditPost {
	data: ISendPost;
	id: string;
}

export interface IComment {
	id: number;
	entityType: 'post' | 'comment' | 'task';
	files: IFile[];
	entityId: number;
	authorId: number;
	message: string;
	date: number;
	nextId: number | null;
	prevId: number | null;
	reactions: {
		reaction: number;
		amount: number;
		entityId: number;
	}[];
	notify: INotify;
}

export interface INewPost {
	placeholderInputTitle: string;
	labelInputTitle: string;
	isShowAddPost: boolean;
	valuePlaceholderEditor: string;
	titlePost?: string;
	whichMethod?: string;
	postId?: string;
	authorMood: EmotionType | '';
	fileIds: number[];
	recipients: RecipientsPost;
	group_id?: number;
	notify?: INotify;
}

export interface IEditPostItem {
	id: string;
	title: string;
	fileIds: number[];
	message: string;
	authorId: string;
	editStatus: boolean;
	author_mood: EmotionType | '';
	files: IFile[];
	date: number;
	recipients: RecipientsPost;
	notify?: INotify;
}

export interface IState {
	allPosts: IPost[];
	post: IPost;
	loadPosts: IResponseWithPagination<IPost>;
	newPost: INewPost;
	editPostItem: IEditPostItem;
	isNewPostCreate: boolean;
	loadPost: boolean;
	loadingPosts: boolean;
	loadingCreatePost: boolean;
	loadingEditPost: boolean;
	loadingDeletePost: boolean;
	errorLoadingPosts: IErrorsAxiosResponse;
	errorLoadingCreatedPost: IErrorsAxiosResponse;
	errorEditingPost: IErrorsAxiosResponse;
	errorDeletingPost: IErrorsAxiosResponse;
}
